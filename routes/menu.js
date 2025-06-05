const express = require('express');
const router = express.Router();
const MenuItem = require('../models/MenuItem');

router.get('/', async (req, res) => {
  const { category, type, price, page = 1, limit = 9 } = req.query;
  let query = {};
  if (category) query.category = category;
  if (type) query.type = type;

  const sort = price === 'low-to-high' ? { price: 1 } : price === 'high-to-low' ? { price: -1 } : {};

  try {
    const totalItems = await MenuItem.countDocuments(query);
    const items = await MenuItem.find(query)
      .sort(sort)
      .skip((page - 1) * limit)
      .limit(Number(limit));
    console.log('Query:', query);
    console.log('Items found:', items);
    console.log('Total items:', totalItems);
    res.json({ items, totalItems });
  } catch (err) {
    console.error('Error in /api/menu:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;