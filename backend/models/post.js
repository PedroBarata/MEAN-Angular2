const mongoose = require('mongoose');

const postSchema = mongoose.Schema({
  title: { type: String, require: true},
  content: { type: String, require: true},
});

module.exports = mongoose.model('Post', postSchema);
//Esse modelo é um "construtor", na qual podemos instanciar em qualquer lugar em que for importado
