const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const userSchema = mongoose.Schema({
  /*O unique não lança uma exeção,
  como o required, por isso é necessário
  tratar essa questão antes de enviar ao backend para salvar!
  -> PARA ISSO, USA-SE O PACOTE MONGOSE-UNIQUE-VALIDATOR! */
  email: { type: String, required: true, unique: true},
  password: { type: String, required: true}

});

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('User', userSchema);
//Esse modelo é um "construtor", na qual podemos instanciar em qualquer lugar em que for importado
