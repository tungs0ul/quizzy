use futures::StreamExt;
use rust_embed::RustEmbed;
use serde::Deserialize;
use serde_json::Value;
use std::env;
use std::net::SocketAddr;
use std::{collections::HashMap, sync::Arc};
use tokio::sync::{mpsc, RwLock};
use tokio_stream::wrappers::UnboundedReceiverStream;
use warp::ws::{Message, WebSocket};
use warp::{http::header::HeaderValue, path::Tail, reply::Response, Filter, Rejection, Reply};

#[derive(RustEmbed)]
#[folder = "client/dist/"]
struct Asset;

static NEXT_USERID: std::sync::atomic::AtomicUsize = std::sync::atomic::AtomicUsize::new(1);

type Users = Arc<RwLock<HashMap<usize, mpsc::UnboundedSender<Result<Message, warp::Error>>>>>;

static mut QUESTION: String = String::new();
static mut ANSWERS: Vec<i32> = Vec::new();

#[derive(Deserialize)]
struct Password {
    password: String,
}

async fn login(password: Password) -> Result<impl warp::Reply, warp::Rejection> {
    match password.password.as_str() {
        "admin" => Ok("Success"),
        _ => Ok("Error"),
    }
}

#[tokio::main]
async fn main() {
    let addr = env::args()
        .nth(1)
        .unwrap_or_else(|| "0.0.0.0:8080".to_string());
    let socket_address: SocketAddr = addr.parse().expect("valid socket Address");

    let users = Users::default();
    let users = warp::any().map(move || users.clone());

    unsafe {
        QUESTION = String::from(
            "{\"type\": \"question\", \"data\": \"Yes or No\", \"options\": [\"Yes\", \"No\"]}",
        );
        ANSWERS = Vec::new();
        ANSWERS.push(0);
        ANSWERS.push(0);
    }

    // GET /ws
    let chat = warp::path("ws")
        .and(warp::ws())
        .and(users)
        .map(|ws: warp::ws::Ws, users| ws.on_upgrade(move |socket| connect(socket, users)));

    // let index = warp::fs::dir("./client/dist");
    // let index = warp::fs::dir("static");

    let index = warp::path::end().and_then(serve_index);
    let dist = warp::path("dist").and(warp::path::tail()).and_then(serve);

    let admin = warp::post()
        .and(warp::path("admin"))
        .and(warp::body::json())
        .and_then(login);

    // let cors = warp::cors()
    //     .allow_any_origin()
    //     .allow_headers(vec!["*"])
    //     .allow_methods(vec!["POST"]);

    // let routes = chat.or(files).or(admin).with(cors);
    let routes = chat.or(index).or(admin);

    println!("Running on {}", socket_address);
    warp::serve(routes).run(socket_address).await;
}

async fn connect(ws: WebSocket, users: Users) {
    // Bookkeeping
    let my_id = NEXT_USERID.fetch_add(1, std::sync::atomic::Ordering::Relaxed);
    // println!("Welcome User {}", my_id);

    // Establishing a connection
    let (user_tx, mut user_rx) = ws.split();
    let (tx, rx) = mpsc::unbounded_channel();

    let rx = UnboundedReceiverStream::new(rx);

    tokio::spawn(rx.forward(user_tx));

    unsafe {
        let x = format!("{{\"type\": \"result\", \"data\": {:?}}}", ANSWERS);
        tx.send(Ok(Message::text(QUESTION.as_str())))
            .expect("Error");
        tx.send(Ok(Message::text(x.as_str()))).expect("Error");
        // tx.send(Ok(Message::text("Hello"))).expect("Error");
    }
    users.write().await.insert(my_id, tx);

    // Reading and broadcasting messages
    while let Some(result) = user_rx.next().await {
        let message = result.expect("Error while reading from websocket");
        if let Ok(_) = message.to_str() {
            let msg = message.to_str().unwrap();
            // println!("received: {}", msg);
            let v: Value = serde_json::from_str(msg).unwrap();
            let msg_type = v["type"].as_str().unwrap();
            let data = v["data"].as_str().unwrap();

            match msg_type {
                "question" => {
                    // println!("Question: {}", data);
                    unsafe {
                        let options = v["options"].as_array().unwrap();
                        ANSWERS.clear();
                        for _ in options.iter() {
                            ANSWERS.push(0);
                        }
                        QUESTION = msg.to_string();
                        broadcast_msg(&msg, &users).await;
                    }
                }
                "answer" => {
                    // println!("Answer: {}", data);
                    unsafe {
                        let idx: usize = data.parse().unwrap();
                        if idx < ANSWERS.len() {
                            ANSWERS[idx] += 1;
                            let x = format!("{{\"type\": \"result\", \"data\": {:?}}}", ANSWERS);
                            broadcast_msg(&x.as_str(), &users).await;
                        }
                    }
                }
                "stop" => {
                    // println!("Stop");
                    unsafe {
                        QUESTION = String::new();
                        broadcast_msg(&msg, &users).await;
                    }
                }
                "clear" => {
                    // println!("Clear");
                    unsafe {
                        for i in 0..ANSWERS.len() {
                            ANSWERS[i] = 0;
                        }
                        broadcast_msg(&msg, &users).await;
                    }
                }
                "reset" => {
                    // println!("Reset");
                    unsafe {
                        QUESTION = String::new();
                        ANSWERS = Vec::new();
                        broadcast_msg(&msg, &users).await;
                    }
                }
                _ => {
                    println!("Unknown message: {}", msg_type);
                }
            }
        }
    }

    // Disconnect
    disconnect(my_id, &users).await;
}

async fn broadcast_msg(msg: &str, users: &Users) {
    for (&_uid, tx) in users.read().await.iter() {
        tx.send(Ok(Message::text(msg.clone())))
            .expect("Failed to send message");
    }
}

async fn disconnect(my_id: usize, users: &Users) {
    // println!("Good bye user {}", my_id);

    users.write().await.remove(&my_id);
}

async fn serve_index() -> Result<impl Reply, Rejection> {
    serve_impl("index.html")
}

async fn serve(path: Tail) -> Result<impl Reply, Rejection> {
    serve_impl(path.as_str())
}

fn serve_impl(path: &str) -> Result<impl Reply, Rejection> {
    let asset = Asset::get(path).ok_or_else(warp::reject::not_found)?;
    let mime = mime_guess::from_path(path).first_or_octet_stream();

    let mut res = Response::new(asset.data.into());
    res.headers_mut().insert(
        "content-type",
        HeaderValue::from_str(mime.as_ref()).unwrap(),
    );
    Ok(res)
}
