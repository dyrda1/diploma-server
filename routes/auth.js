const express = require('express');
   const router = express.Router();
   const jwt = require('jsonwebtoken');
   const User = require('../models/User');

   router.post('/login', async (req, res) => {
     const { username, password } = req.body;
     try {
       const user = await User.findOne({ username });
       if (!user) return res.status(400).json({ message: 'Невірний логін або пароль' });

       const isMatch = await user.comparePassword(password);
       if (!isMatch) return res.status(400).json({ message: 'Невірний логін або пароль' });

       const token = jwt.sign({ userId: user._id, role: user.role }, 'your_jwt_secret', {
         expiresIn: '1h',
       });
       res.json({ token });
     } catch (error) {
       console.error('Login error:', error);
       res.status(500).json({ message: 'Помилка сервера' });
     }
   });


   // Тимчасовий маршрут для створення користувача
router.post('/register', async (req, res) => {
  const { username, password } = req.body;
  try {
    const existingUser = await User.findOne({ username });
    if (existingUser) return res.status(400).json({ message: 'Користувач уже існує' });

    const user = new User({ username, password, role: 'admin' });
    await user.save();
    res.json({ message: 'Користувач створений' });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ message: 'Помилка сервера' });
  }
});

   module.exports = router;