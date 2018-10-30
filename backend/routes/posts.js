const express = require("express");

const router = express.Router();
const checkAuth = require("../middleware/check-auth");
const extractFile = require("../middleware/file");
const PostController = require("../controllers/posts");

router.post(
  "",
  checkAuth, //Executa os middlewares por ordem, logo, se der erro na autorização, ele nem vai executar o multer
  extractFile,
  PostController.createPost
);

router.put("/:id", checkAuth, extractFile, PostController.updatePost);

router.get("/:id", PostController.getPost);

router.get("", PostController.getPosts);

router.delete("/:id", checkAuth, PostController.deletePost);

module.exports = router;
