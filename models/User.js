const mongoose = require('mongoose');
   const bcrypt = require('bcryptjs');

   const userSchema = new mongoose.Schema({
     username: { type: String, required: true, unique: true },
     password: { type: String, required: true },
     role: { type: String, default: 'admin' },
   });

   // Шифрування пароля перед збереженням
   userSchema.pre('save', async function (next) {
     if (!this.isModified('password')) return next();
     this.password = await bcrypt.hash(this.password, 10);
     next();
   });

   // Метод для перевірки пароля
   userSchema.methods.comparePassword = async function (candidatePassword) {
     return await bcrypt.compare(candidatePassword, this.password);
   };

   module.exports = mongoose.model('User', userSchema);