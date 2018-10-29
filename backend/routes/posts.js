const express = require("express");

const router = express.Router();
const Post = require("../models/post"); //Convenção passar o model com letra maiuscula
const checkAuth = require("../middleware/check-auth");

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
  checkAuth, //Executa os middlewares por ordem, logo, se der erro na autorização, ele nem vai executar o multer
  multer({ storage: storage }).single("image"),
  (req, res, next) => {
    const url = req.protocol + "://" + req.get("host");
    const post = new Post({
      title: req.body.title,
      content: req.body.content,
      imagePath: url + "/images/" + req.file.filename,
      creator: req.userData.userId
    });
    post.save().then(createdPost => {
      res.status(201).json({
        message: "Post added successfully!",
        post: {
          ...createdPost, //Copia todas as informações do objeto
          id: createdPost._id
        }
      });
    })
    .catch(error => {
      res.status(500).json({
        message: "Creating a post failed!"
      });
    });
  }
);

router.put(
  "/:id",
  checkAuth,
  multer({ storage: storage }).single("image"),
  (req, res, next) => {
    let imagePath = req.body.imagePath;
    if (req.file) {
      //Se for undefined, é uma string
      const url = req.protocol + "://" + req.get("host");
      imagePath = url + "/images/" + req.file.filename;
    }
    const post = new Post({
      _id: req.body.id,
      title: req.body.title,
      content: req.body.content,
      imagePath: imagePath,
      creator: req.userData.userId
    });
    Post.updateOne({ _id: req.params.id, creator: req.userData.userId }, post).then(result => {
      if(result.nModified > 0) {/* Quer dizer que um objeto foi modificado */
        res.status(200).json({
          message: "Updated successfully!"
        });
      } else {
        res.status(401).json({
          message: "Unauthorized!"
        });
      }
    })
    .catch(error => {
      res.status(500).json({
        message: "Couldn't update the post!"
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
  })
  .catch(error => {
    res.status(500).json({
      message: "Fetching post failed!"
    });
  });
});

router.get("", (req, res, next) => {
  const pageSize = +req.query.pagesize; //Nomes arbitrários, Tem que ser numerico, por isso o "+"
  const currentPage = +req.query.page;
  const postQuery = Post.find();
  let fetchedPosts;
  if (pageSize && currentPage) {
    postQuery.skip(pageSize * (currentPage - 1)).limit(pageSize);
  }
  postQuery
    .then(documents => {
      fetchedPosts = documents;
      return Post.count();
    })
    .then(count => {
      res.status(200).json({
        message: "Post fecthed successfully!",
        posts: fetchedPosts,
        maxPosts: count
      });
    })
    .catch(error => {
      res.status(500).json({
        message: "Fetching posts failed!"
      });
    });
});

router.delete("/:id", checkAuth, (req, res, next) => {
  Post.deleteOne({ _id: req.params.id, creator: req.userData.userId }).then(() => {
    if(result.n > 0) {/* Quer dizer que um objeto foi DELETADO */
      console.log("Deleted!");
      res.status(200).json({
        message: "Post deleted successfully!"
      });
    } else {
      res.status(401).json({
        message: "Unauthorized!"
      });
    }
  })
  .catch(error => {
    res.status(500).json({
      message: "Fetching posts failed!"
    });
  });
});

module.exports = router;
