const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  orderId: { type: String, required: true, unique: true },
  orderDate: { type: Date, default: Date.now },
  weekNumber: Number,
  dozens: Number,
  pricePerDozen: Number,
  totalAmount: Number,
  clientName: String,
  clientPhone: String,
  clientCity: String,
  deliveryDate: Date,
  deliveryLocation: { type: String, enum: ["Lugar A", "Lugar B"] }
});

module.exports = mongoose.model('Order', orderSchema);

