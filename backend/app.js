const express = require("express");

const bodyParser = require("body-parser");
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false})); //Para mostrar que o body-parser aceita vários tipos de requests.


app.use((req, res, next) => {
  /* Precisa setar os HEADERS por segurança do backend (CORS ERROR),
  onde só é permitido acesso à mesma porta, o que não é o que queremos,
  já que o front está rodando na 4200 e o back na 3000. */
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS"
  );
  next();
});

app.post("/api/posts", (req, res, next) => {
  const post = req.body;
  console.log(post);
  return res.status(201).json({
    message: "Post added successfully!"
  });
});

app.use("/api/posts", (req, res, next) => {
  let posts = [
    {
      id: "asdas2323123",
      title: "First server-side post",
      content: "This is coming from the server"
    },
    {
      id: "wjqehwiqu12",
      title: "Second server-side post",
      content: "This is coming from the server"
    }
  ];
  res.status(200).json({
    message: "Post fecthed successfully!",
    posts: posts
  });
});

module.exports = app;
