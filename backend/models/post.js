const mongoose = require("mongoose");

const postSchema = mongoose.Schema({
  title: { type: String, require: true },
  content: { type: String, require: true },
  imagePath: { type: String, require: true },
  /* É como o mongoose interpreta um id de um objeto */
  creator: { type: mongoose.Schema.Types.ObjectId, ref: "User", require: true }
});

module.exports = mongoose.model("Post", postSchema);
//Esse modelo é um "construtor", na qual podemos instanciar em qualquer lugar em que for importado
