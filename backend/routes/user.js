const express = require("express");

const router = express.Router();

const UserController = require("../controllers/user");
/* Não precisa passar o método como uma função, só como referência. O express resolve o resto. */
router.post("/signup", UserController.createUser);

router.post("/login", UserController.userLogin);

module.exports = router;
