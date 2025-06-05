const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  date: { type: Date, required: true },
  time: { type: String, required: true },
  people: { type: Number, required: true },
  items: [{ itemId: { type: mongoose.Schema.Types.ObjectId, ref: 'MenuItem' }, quantity: Number }],
  status: { type: String, default: 'pending' },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Booking', bookingSchema);

