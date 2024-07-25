const mongoose = require('mongoose')

const prendaSchema = new mongoose.Schema({
    codigo: { type: Number, required: true },
    nombre: { type: String, required: true },
    precio: { type: Number, required: true },
    categoria: { type: String, required: true },
});

const Prenda = mongoose.model('Prenda', prendaSchema)
module.exports = Prenda;
