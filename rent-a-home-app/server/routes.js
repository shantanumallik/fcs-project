// routes.js
const express = require('express');
const userRoutes = require('./routes/user');
const propertyRoutes = require('./routes/property'); // <-- Import the property routes

const router = express.Router();

router.use('/users', userRoutes);
router.use('/properties', propertyRoutes); // <-- Add this line to use property routes

module.exports = router;
