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
type Answer = Arc<RwLock<HashMap<String, Vec<i32>>>>;
type Info = Arc<RwLock<HashMap<String, String>>>;

#[derive(Deserialize)]
struct Password {
    password: String,
}

async fn login(
    secret: Arc<String>,
    password: Password,
) -> Result<impl warp::Reply, warp::Rejection> {
    if password.password.as_str() == secret.as_str() {
        return Ok("Success");
    }
    return Ok("Error");
}

#[tokio::main]
async fn main() {
    let addr = env::args()
        .nth(1)
        .unwrap_or_else(|| "0.0.0.0:8080".to_string());

    let secret = env::args().nth(2).unwrap_or_else(|| "admin".to_string());

    let socket_address: SocketAddr = addr.parse().expect("valid socket Address");

    let users = Users::default();
    let users = warp::any().map(move || users.clone());

    let info = Info::default();
    info.write().await.insert(
        "question".to_string(),
        "{\"type\": \"question\", \"data\": \"Yes or No\", \"options\": [\"Yes\", \"No\"]}"
            .to_string(),
    );
    info.write().await.insert(
        "active".to_string(),
        "{\"type\": \"stop\", \"data\": \"\"}".to_string(),
    );
    let info = warp::any().map(move || info.clone());

    let answers = Answer::default();
    answers
        .write()
        .await
        .insert("answer".to_string(), vec![0, 0]);
    let answers = warp::any().map(move || answers.clone());

    let chat = warp::path("ws")
        .and(warp::ws())
        .and(users)
        .and(info)
        .and(answers)
        .map(|ws: warp::ws::Ws, users, info, answers| {
            ws.on_upgrade(move |socket| connect(socket, users, info, answers))
        });

    let index = warp::path::end().and_then(serve_index);
    let dist = warp::get().and(warp::path::tail()).and_then(serve);

    let secret = Arc::new(secret);
    let secret = warp::any().map(move || secret.clone());
    let admin = warp::post()
        .and(warp::path("admin"))
        .and(secret.clone())
        .and(warp::body::json())
        .and_then(login);

    let routes = chat.or(index).or(dist).or(admin);

    println!("Running on {}", socket_address);
    warp::serve(routes).run(socket_address).await;
}

async fn connect(ws: WebSocket, users: Users, info: Info, answers: Answer) {
    let my_id = NEXT_USERID.fetch_add(1, std::sync::atomic::Ordering::Relaxed);

    let (user_tx, mut user_rx) = ws.split();
    let (tx, rx) = mpsc::unbounded_channel();

    let rx = UnboundedReceiverStream::new(rx);

    for (_, v) in info.read().await.iter() {
        tx.send(Ok(Message::text(v.as_str()))).expect("Error");
    }

    for (_, v) in answers.read().await.iter() {
        let x = format!("{{\"type\": \"result\", \"data\": {:?}}}", v);
        tx.send(Ok(Message::text(x.as_str()))).expect("Error");
    }

    tokio::spawn(rx.forward(user_tx));

    users.write().await.insert(my_id, tx);

    while let Some(result) = user_rx.next().await {
        let message = result.expect("Error while reading from websocket");
        if let Ok(_) = message.to_str() {
            let msg = message.to_str().unwrap();
            let v: Value = serde_json::from_str(msg).unwrap();
            let msg_type = v["type"].as_str().unwrap();
            let data = v["data"].as_str().unwrap();

            match msg_type {
                "question" => {
                    info.write()
                        .await
                        .insert("question".to_string(), msg.to_string());
                    info.write().await.insert(
                        "active".to_string(),
                        "{\"type\": \"start\", \"data\": \"\"}".to_string(),
                    );
                    let options = v["options"].as_array().unwrap();
                    let mut answer: Vec<i32> = Vec::new();
                    for _ in options.iter() {
                        answer.push(0);
                    }
                    answers.write().await.insert("answer".to_string(), answer);
                    broadcast_msg(&msg, &users).await;
                }
                "answer" => {
                    let idx: usize = data.parse().unwrap();
                    let mut answer: Vec<i32> = Vec::new();
                    for (_, v) in answers.read().await.iter() {
                        for i in 0..v.len() {
                            answer.push(v[i]);
                        }
                    }
                    if idx < answer.len() {
                        answer[idx] += 1;
                        let x = format!("{{\"type\": \"result\", \"data\": {:?}}}", &answer);
                        broadcast_msg(&x.as_str(), &users).await;
                        answers.write().await.insert("answer".to_string(), answer);
                    }
                }
                "start" => {
                    info.write()
                        .await
                        .insert("active".to_string(), msg.to_string());
                    broadcast_msg(&msg, &users).await;
                }
                "stop" => {
                    info.write()
                        .await
                        .insert("active".to_string(), msg.to_string());
                    broadcast_msg(&msg, &users).await;
                }
                "clear" => {
                    let mut answer: Vec<i32> = Vec::new();
                    for (_, v) in answers.read().await.iter() {
                        for _ in 0..v.len() {
                            answer.push(0);
                        }
                    }
                    broadcast_msg(&msg, &users).await;
                    answers.write().await.insert("answer".to_string(), answer);
                }
                "reset" => {
                    info.write().await.insert("question".to_string(), "{\"type\": \"question\", \"data\": \"Yes or No\", \"options\": [\"Yes\", \"No\"]}".to_string());
                    answers
                        .write()
                        .await
                        .insert("answer".to_string(), vec![0, 0]);
                    broadcast_msg(&msg, &users).await;
                }
                _ => {
                    println!("Unknown message: {}", msg_type);
                }
            }
        }
    }

    disconnect(my_id, &users).await;
}

async fn broadcast_msg(msg: &str, users: &Users) {
    for (&_uid, tx) in users.read().await.iter() {
        tx.send(Ok(Message::text(msg.clone())))
            .expect("Failed to send message");
    }
}

async fn disconnect(my_id: usize, users: &Users) {
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
