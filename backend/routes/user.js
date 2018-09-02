const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const User = require("../models/user");
const router = express.Router();

router.post("/signup", (req, res, next) => {
  /* Precisa-se encryptar o password,
  para quem tiver acesso ao DB não ter acesso as senhas,
  para isso, instala-se um package chamado bcrypt */

  /* O '10' é "o quão difícil" vai ser a senha, pois utiliza
  algoritmos matemáticos para criar o hash da senha */
  bcrypt.hash(req.body.password, 10).then(hash => {
    const user = new User({
      email: req.body.email,
      password: hash
    });
    user
      .save()
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

router.post("/login", (req, res, next) => {
  /* Para mexer com o JWT, é necessário instalar um pacote chamado jsonwebtoken */
  let fetchedUser; /* Para usar o user no segundo then, é necessário passar esse objeto para uma variável externa */
  User.findOne({ email: req.body.email })
    .then(user => {
      if (!user) {
        return res.status(404).json({
          message: "Auth failed"
        });
      }
      fetchedUser = user; //Aqui
      return bcrypt.compare(req.body.password, user.password);
    })
    .then(result => {
      if (!result) {
        return res.status(401).json({
          message: "Auth failed"
        });
      }
      const token = jwt.sign(
        { email: fetchedUser.email, userId: fetchedUser._id }, //E aqui se usa o fetchedUser ao inves do user
        "O_secret_deve_ser_o_mais_longo_possivel!",
        {expiresIn: "1h"} //Nao deve durar muito tempo, pois é bom ficar atualizando o token para o sistema nao ser suscetível a ataques
      );
      console.log(token);

      res.status(200).json({
        token: token
      });
    })
    .catch(err => {
      console.log(err);
      return res.status(401).json({
        message: "Auth failed"
      });
    });
});

module.exports = router;
