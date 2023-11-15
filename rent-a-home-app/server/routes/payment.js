const express = require('express');
const Razorpay = require('razorpay');

const router = express.Router();

// Configure Razorpay
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID, // Your Razorpay Key ID
  key_secret: process.env.RAZORPAY_KEY_SECRET // Your Razorpay Key Secret
});

// Create a payment order
router.post('/create-payment-order', async (req, res) => {
    try {
        const { amount } = req.body; // You'll send the amount from the frontend

        const options = {
            amount: amount * 100, // Razorpay uses the smallest currency unit (e.g., paise for INR)
            currency: 'INR', // or your preferred currency
            receipt: 'rcptid_11', // This is a unique identifier for the order
            payment_capture: '1' // Auto capture the payment
        };

        const order = await razorpay.orders.create(options);

        res.send({
            orderId: order.id,
            key_id: process.env.RAZORPAY_KEY_ID // Send the key id to the client
        });
    } catch (error) {
        console.error('Error creating payment order:', error);
        res.status(500).send({ error: error.message });
    }
});

module.exports = router;
