const jwt = require("jsonwebtoken");

/* Um middleware é essencialmente isso:
uma função que recebe os 3 argumentos conhecidos que é executada
nas solicitações recebidas */
module.exports = (req, res, next) => {
  /* Pode-se obter o token de 3 formas:
  1 - Passando na URL e pegando com o queryParam
      (const token = req.query.auth);
  2 - Passando somente o token no header da requisição;
  3 - (Mais comum), usar a convenção do "Bearer TOKENAQUI";
  Usaremos a 3ª opção e daremos um split no header para pegar
  apenas após a palavra "Bearer" */
  try {
    //Lança um erro caso nao venha um token no header
    const token = req.headers.authorization.split(" ")[1]; //Com isso, pegamos tudo após o " "
    jwt.verify(token, "O_secret_deve_ser_o_mais_longo_possivel!");
    next();
  } catch (error) {
    console.log(error);
    res.status(401).json({
      message: "Auth Failed!"
    });
  }
};