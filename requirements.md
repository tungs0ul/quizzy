# QUIZZY

## Purposes

- The quizzes should be accessible via a Webserver, so that students can access them via their smart phone easily or via their computer during the lecture. At first start, it would be enough to just create a multiple choce poll with the only parameter the number of answers. The question would come from a different media. Later the actual question could be incoporated (editable e.g. via Markdown) it should be also possible to bring up some fancy diagrams with nice animations in realtime. A complete requirements engineeing process needs to be done.

- To find out how practical it is, to use Rust for web development

## Use Cases

- ### Teacher can create new quiz (multiple choices question) from
  - ### input page (keyboard)
  - ### files (json, md, text)
- ### Teacher can start new quiz
- ### Teacher can see the result (in chart format) live
- ### Teacher can stop quiz
- ### Student can see the quiz and answer quiz
- ### Student can see the result at the end
- ### Student can see the result live (optional)

## Requirements

- ### Backend

  Server should provide web socket connection

  - ### Language: Rust
  - ### Framework (optional): Arctix / Rocket/ Warp
  - ### Database (optional): SQLite

- ### Frontend

  It should be in form of web app (responsive) so students can easy connect to the server from there devices (PC, laptop, mobile, tablet ...) without any installing nor downloading anything.

  - ### HTML, CSS, JS
  - ### React (optional)
  - ### Typescript (optional)
  - ### Tailwind CSS (optional)

- ### DevOps
  The system should be easy to start/deploy on teacher's device
  - Docker (optional)
