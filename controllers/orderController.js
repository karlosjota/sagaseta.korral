const Order = require('../models/Order');
const { v4: uuidv4 } = require('uuid');       // Usamos uuid
const twilio = require('twilio');



// Calcular número de semana
const getWeekNumber = (date) => {
  const firstDay = new Date(date.getFullYear(), 0, 1);
  const pastDays = (date - firstDay) / 86400000;
  return Math.ceil((pastDays + firstDay.getDay() + 1) / 7);
};

exports.createOrder = async (req, res) => {
  try {
    const { dozens, pricePerDozen, clientName, clientPhone, clientCity, deliveryLocation } = req.body;
    const orderDate = new Date();
    const deliveryDate = new Date();
    deliveryDate.setDate(orderDate.getDate() + 2); // Entrega en 2 días

    const newOrder = new Order({
      orderId: uuidv4(), // Generar UID con uuid
      orderDate,
      weekNumber: getWeekNumber(orderDate),
      dozens,
      pricePerDozen,
      totalAmount: dozens * pricePerDozen,
      clientName,
      clientPhone,
      clientCity,
      deliveryDate,
      deliveryLocation
    });

    await newOrder.save();

    // Twilio para enviar mensaje de WhatsApp
    const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

    await client.messages.create({
  from: `whatsapp:${process.env.WHATSAPP_FROM}`,
  to: `whatsapp:+34NUMERO_DEL_CLIENTE`,
  body: `Hola ${clientName}, tu pedido (#${newOrder.orderId}) será entregado el ${deliveryDate.toLocaleDateString()} en ${deliveryLocation}. Total: ${newOrder.totalAmount}€`
});

    res.json({
      message: "Pedido creado con éxito y mensaje enviado por WhatsApp",
      order: newOrder
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
