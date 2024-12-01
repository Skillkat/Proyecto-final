const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
    code: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    photo: { type: String },
    description: { type: String },
    quantity: { type: Number, required: true },
    price: { type: Number, required: true }
});

module.exports = mongoose.model('Product', ProductSchema);
