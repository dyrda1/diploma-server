const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const MenuItem = require('../models/MenuItem');
const multer = require('multer');
const path = require('path');

// Налаштування Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});
const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);
    if (extname && mimetype) {
      return cb(null, true);
    }
    cb('Помилка: Дозволені лише зображення (jpeg, jpg, png)!');
  },
});

// Додавання страви (Create) з завантаженням зображення
router.post('/menu', auth, upload.single('image'), async (req, res) => {
  try {
    const { name, price, category, type } = req.body;
    const image = req.file ? `/uploads/${req.file.filename}` : '';
    const menuItem = new MenuItem({ name, price, category, type, image });
    await menuItem.save();
    res.json({ message: 'Menu item added', menuItem });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Отримання всіх страв (Read) із пагінацією
router.get('/menu', auth, async (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  try {
    const menuItems = await MenuItem.find()
      .skip((page - 1) * limit)
      .limit(Number(limit));
    res.json(menuItems);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Оновлення страви (Update) з можливістю оновлення зображення
router.put('/menu/:id', auth, upload.single('image'), async (req, res) => {
  try {
    const { name, price, category, type } = req.body;
    const updateData = { name, price, category, type };
    if (req.file) {
      updateData.image = `/uploads/${req.file.filename}`;
    }
    const menuItem = await MenuItem.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
    });
    if (!menuItem) return res.status(404).json({ message: 'Menu item not found' });
    res.json({ message: 'Menu item updated', menuItem });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Видалення страви (Delete)
router.delete('/menu/:id', auth, async (req, res) => {
  try {
    const menuItem = await MenuItem.findByIdAndDelete(req.params.id);
    if (!menuItem) return res.status(404).json({ message: 'Menu item not found' });
    res.json({ message: 'Menu item deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;