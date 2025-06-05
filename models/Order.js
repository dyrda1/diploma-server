const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  items: [{ itemId: { type: mongoose.Schema.Types.ObjectId, ref: 'MenuItem' }, quantity: Number }],
  type: { type: String, required: true }, // in-restaurant, takeaway, booking
  table: { type: String }, // для in-restaurant
  deliveryTime: { type: Date }, // для takeaway
  bookingDetails: { date: Date, people: Number }, // для booking
  status: { type: String, default: 'pending' }, // pending, confirmed, completed
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Order', orderSchema);