const express = require("express");
const bcrypt = require("bcrypt");

const User = require("../models/user");
const router = express.Router();

router.post("/signup", (req, res, next) => {
  /* Precisa-se encryptar o password,
  para quem tiver acesso ao DB não ter acesso as senhas,
  para isso, instala-se um package chamado bcrypt */

  /* O '10' é "o quão difícil" vai ser a senha, pois utiliza
  algoritmos matemáticos para criar o hash da senha */
  bcrypt.hash(req.body.password, 10)
  .then(hash => {
    const user = new User({
      email: req.body.email,
      password: hash
    });
    user.save()
    .then(result => {
      res.status(201).json({
        message: "User created!",
        result: result
      });
    })
    .catch(err => {
      res.status(500).json({
        message: err
      });
    });
  });
});


module.exports = router;
