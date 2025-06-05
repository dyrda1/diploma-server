const mongoose = require('mongoose');

const menuItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  category: { type: String, required: true },
  type: { type: String },
  image: { type: String }, // Шлях до зображення
});

module.exports = mongoose.model('MenuItem', menuItemSchema);