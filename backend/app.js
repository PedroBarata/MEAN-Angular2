const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const app = express();

const postsRoutes = require("./routes/posts");

const mongoose = require("mongoose");

mongoose
  .connect(
    "mongodb+srv://pedro:VjYbvzf8A2ifwhXC@meanstackmax-ggarw.mongodb.net/node-angular?retryWrites=true"
  )
  .then(() => {
    console.log("Successfully connected!");
  })
  .catch(() => {
    console.log("Error in connection!");
  });

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false })); //Para mostrar que o body-parser aceita vários tipos de requests.
app.use("/images", express.static(path.join("backend/images/")));

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

app.use("/api/posts", postsRoutes);


module.exports = app;
