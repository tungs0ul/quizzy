# INSTALL

- fronted needed to be built first

## Fontend

- you might need to install typescript

###

    npm i -g typescript

- then run these following commands

###

    cd client
    npm i
    npm run build

## Server

- run

###

    cargo run [port (default 8080)] [secret key for admin page (default "admin")]

- build

###

    cargo build --release

- the binary contains frontend files and can be deploy on any linux machine

###

    ./quizzy

- with port 3000

###

    ./quizzy 3000

- secret key is @dmin

###

    ./quizzy 3000 @dmin
