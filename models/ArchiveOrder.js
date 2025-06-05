const mongoose = require('mongoose');

const archiveOrderSchema = new mongoose.Schema({
  ...require('./Order').schema.obj, // Копіюємо схему Order
  archivedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('ArchiveOrder', archiveOrderSchema);