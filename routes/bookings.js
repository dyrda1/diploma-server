const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const ArchiveBooking = require('../models/ArchiveBooking');

// Отримуємо io через аргумент
module.exports = (io) => {
  router.post('/', async (req, res) => {
    try {
      const booking = new Booking(req.body);
      await booking.save();
      io.emit('newBooking', booking); // Відправляємо подію newBooking
      res.json({ message: 'Booking created', booking });
    } catch (err) {
      res.status(500).json({ message: 'Server error', error: err.message });
    }
  });

  router.get('/archived', async (req, res) => {
    const { page = 1, limit = 10 } = req.query;
    try {
      const archivedBookings = await ArchiveBooking.find()
        .populate('items.itemId')
        .sort({ archivedAt: -1 })
        .skip((page - 1) * limit)
        .limit(Number(limit));
      res.json(archivedBookings);
    } catch (err) {
      res.status(500).json({ message: 'Server error', error: err.message });
    }
  });

  router.get('/', async (req, res) => {
    const { page = 1, limit = 10 } = req.query;
    try {
      const bookings = await Booking.find()
        .populate('items.itemId')
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(Number(limit));
      res.json(bookings);
    } catch (err) {
      res.status(500).json({ message: 'Server error', error: err.message });
    }
  });

  router.put('/:id/complete', async (req, res) => {
    try {
      const booking = await Booking.findById(req.params.id);
      if (!booking) return res.status(404).json({ message: 'Booking not found' });

      const archiveBooking = new ArchiveBooking({
        ...booking.toObject(),
        archivedAt: new Date(),
      });
      await archiveBooking.save();

      await Booking.findByIdAndDelete(req.params.id);
      res.json({ message: 'Booking marked as completed and archived' });
    } catch (err) {
      res.status(500).json({ message: 'Server error', error: err.message });
    }
  });

  return router;
};