const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const ArchiveOrder = require('../models/ArchiveOrder');

// Отримуємо io через аргумент
module.exports = (io) => {
  router.post('/', async (req, res) => {
    try {
      const order = new Order(req.body);
      await order.save();
      io.emit('newOrder', order); // Відправляємо подію newOrder
      res.json({ message: 'Order created', order });
    } catch (err) {
      res.status(500).json({ message: 'Server error', error: err.message });
    }
  });

  router.get('/', async (req, res) => {
    const { page = 1, limit = 10 } = req.query;
    try {
      const orders = await Order.find()
        .populate('items.itemId')
        .sort({ deliveryTime: 1, createdAt: 1 }) // Сортування за deliveryTime і createdAt від найближчих до найдальших
        .skip((page - 1) * limit)
        .limit(Number(limit));
      res.json(orders);
    } catch (err) {
      res.status(500).json({ message: 'Server error', error: err.message });
    }
  });

  router.get('/archived', async (req, res) => {
    const { page = 1, limit = 10 } = req.query;
    try {
      const archivedOrders = await ArchiveOrder.find()
        .populate('items.itemId')
        .sort({ archivedAt: -1 })
        .skip((page - 1) * limit)
        .limit(Number(limit));
      res.json(archivedOrders);
    } catch (err) {
      res.status(500).json({ message: 'Server error', error: err.message });
    }
  });

  router.put('/:id/complete', async (req, res) => {
    try {
      const order = await Order.findById(req.params.id);
      if (!order) return res.status(404).json({ message: 'Order not found' });

      const archiveOrder = new ArchiveOrder({
        ...order.toObject(),
        archivedAt: new Date(),
      });
      await archiveOrder.save();

      await Order.findByIdAndDelete(req.params.id);
      res.json({ message: 'Order marked as completed and archived' });
    } catch (err) {
      res.status(500).json({ message: 'Server error', error: err.message });
    }
  });

  return router;
};