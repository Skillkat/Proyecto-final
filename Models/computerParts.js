const mongoose = require('mongoose');

const ComputerPartSchema = new mongoose.Schema({
    code: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    photo: { type: String },
    description: { type: String },
    quantity: { type: Number, required: true },
    price: { type: Number, required: true }
});

module.exports = mongoose.model('ComputerPart', ComputerPartSchema);
