const express = require("express");

const router = express.Router();
const Post = require("../models/post"); //Convenção passar o model com letra maiuscula

const multer = require("multer");

const MIME_TYPE_MAP = {
  "image/png": "png",
  "image/jpg": "jpg",
  "image/jpeg": "jpg"
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    //request, file e callback
    /* Pega o diretório a partir do servidor (no caso o server.js),
    por isso a adição do backend antes da pasta images. */
    const isValid = MIME_TYPE_MAP[file.mimetype]; //Verifica se o tipo de arquivo é valido.
    let error = new Error("Invalid mime type");
    if (isValid) {
      error = null;
    }
    cb(error, "backend/images");
  },
  filename: (req, file, cb) => {
    //Define um nome padrao, colocando tudo em minúsculo e trocando espaços por -
    const name = file.originalname
      .toLowerCase()
      .split(" ")
      .join("-");
    const ext = MIME_TYPE_MAP[file.mimetype];
    cb(null, name + "-" + Date.now() + "." + ext);
  }
});

router.post(
  "",
  multer({ storage: storage }).single("image"),
  (req, res, next) => {
    const url = req.protocol + "://" + req.get("host");
    const post = new Post({
      title: req.body.title,
      content: req.body.content,
      imagePath: url + "/images/" + req.file.filename
    });
    post.save().then(createdPost => {
      res.status(201).json({
        message: "Post added successfully!",
        post: {
          ...createdPost, //Copia todas as informações do objeto
          id: createdPost._id
        }
      });
    });
  }
);

router.put(
  "/:id",
  multer({ storage: storage }).single("image"),
  (req, res, next) => {
    let imagePath = req.body.imagePath;
    if(req.file) { //Se for undefined, é uma string
      const url = req.protocol + "://" + req.get("host");
      imagePath = url + "/images/" + req.file.filename
    }
    const post = new Post({
      _id: req.body.id,
      title: req.body.title,
      content: req.body.content,
      imagePath: imagePath
    });
    Post.updateOne({ _id: req.params.id }, post).then(result => {
      console.log(result);
      res.status(200).json({
        message: "Updated successfully!"
      });
    });
  }
);

router.get("/:id", (req, res, next) => {
  Post.findById(req.params.id).then(post => {
    if (post) {
      res.status(200).json(post);
    } else {
      res.status(404).json({
        message: "Post not found!"
      });
    }
  });
});

router.get("", (req, res, next) => {
  Post.find().then(documents => {
    res.status(200).json({
      message: "Post fecthed successfully!",
      posts: documents
    });
  });
});

router.delete("/:id", (req, res, next) => {
  Post.deleteOne({ _id: req.params.id }).then(() => {
    console.log("Deleted!");
    res.status(200).json({
      message: "Post deleted successfully!"
    });
  });
});

module.exports = router;
