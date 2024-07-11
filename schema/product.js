const mongoose = require('mongoose')

const prendaSchema = new mongoose.Schema({
    codigo: Number,
    nombre: String,
    precio: Number,
    categoria: String,

});

const Prenda =  mongoose.model('Prenda', prendaSchema)
module.exports = Prenda;
