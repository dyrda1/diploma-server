const mongoose = require('mongoose');

const archiveBookingSchema = new mongoose.Schema({
  ...require('./Booking').schema.obj, // Копіюємо схему Booking
  archivedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('ArchiveBooking', archiveBookingSchema);