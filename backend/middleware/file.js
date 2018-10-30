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

module.exports = multer({ storage: storage }).single("image");
