const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const connectDB = require('./config/db');
const menuRoutes = require('./routes/menu');
const orderRoutes = require('./routes/orders');
const bookingRoutes = require('./routes/bookings');
const adminRoutes = require('./routes/admin');
const authRoutes = require('./routes/auth');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*' } });

app.use(cors());
app.use(express.json());

// Додаємо віддачу статичних файлів із папки uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Підключення до MongoDB
connectDB();

// Передаємо io до роутів
app.use('/api/menu', menuRoutes);
app.use('/api/orders', orderRoutes(io));
app.use('/api/bookings', bookingRoutes(io));
app.use('/api/admin', adminRoutes);
app.use('/api/auth', authRoutes);

// Видаляємо дублюючі app.post
io.on('connection', (socket) => {
  console.log('Admin connected');
  socket.on('disconnect', () => console.log('Admin disconnected'));
});

server.listen(5000, () => console.log('Server running on port 5000'));