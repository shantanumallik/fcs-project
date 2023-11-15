// routes.js
const express = require('express');
const userRoutes = require('./routes/user');
const propertyRoutes = require('./routes/property');
const paymentRoutes = require('./routes/payment');


const router = express.Router();

router.use('/users', userRoutes);
router.use('/properties', propertyRoutes);
router.use('/payment', paymentRoutes);

module.exports = router;
