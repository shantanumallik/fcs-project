// routes/admin.js
const express = require('express');
const { ObjectId } = require('mongodb');
const db = require('../db');
const jwt = require('jsonwebtoken');

const router = express.Router();

// Middleware to ensure the user is an admin
const ensureAdmin = async (req, res, next) => {
    // const token = req.headers.authorization && req.headers.authorization.split(" ")[1];
    const token = req.cookies.session_token
    if (!token) {
        return res.status(401).send('Authentication token missing');
    }

    try {
        const payload = jwt.verify(token, process.env.SECRET_KEY);
        const userId = payload.userId;
        
        const user = await db.getDB().collection("User").findOne({ _id: ObjectId(userId) });
        if (!user || user.userType !== 'admin') {
            return res.status(403).send('Access denied');
        }
        next();
    } catch (err) {
        res.status(401).send('Invalid token');
    }
};

// Get all users by userType
router.get('/users/:userType', ensureAdmin, async (req, res) => {
    try {
        const users = await db.getDB().collection("User").find({ userType: req.params.userType }).toArray();
        res.json(users);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

// Modify a user by ID
router.put('/users/:userId', ensureAdmin, async (req, res) => {
    try {
        const updatedData = {
            email: req.body.email,
            phone: req.body.phone,
            address: req.body.address,
            userType: req.body.userType
        };
        await db.getDB().collection("User").updateOne({ _id: ObjectId(req.params.userId) }, { $set: updatedData });
        res.status(200).send('User updated successfully');
    } catch (error) {
        res.status(500).send(error.message);
    }
});

// Delete a user by ID
router.delete('/users/:userId', ensureAdmin, async (req, res) => {
    try {
        const result = await db.getDB().collection("User").deleteOne({ _id: ObjectId(req.params.userId) });
        if (result.deletedCount === 0) {
            return res.status(404).send('User not found');
        }
        res.status(200).send('User deleted successfully');
    } catch (error) {
        res.status(500).send(error.message);
    }
});

// Get all properties
router.get('/properties', ensureAdmin, async (req, res) => {
    try {
        const properties = await db.getDB().collection("Property").find({}).toArray();
        res.json(properties);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

// Modify a property by ID
router.put('/properties/:propertyId', ensureAdmin, async (req, res) => {
    try {
        const updatedData = {
            title: req.body.title,
            description: req.body.description,
            price: req.body.price,
            images: req.body.images
        };
        await db.getDB().collection("Property").updateOne({ _id: ObjectId(req.params.propertyId) }, { $set: updatedData });
        res.status(200).send('Property updated successfully');
    } catch (error) {
        res.status(500).send(error.message);
    }
});

// Delete a property by ID
router.delete('/properties/:propertyId', ensureAdmin, async (req, res) => {
    try {
        const result = await db.getDB().collection("Property").deleteOne({ _id: ObjectId(req.params.propertyId) });
        if (result.deletedCount === 0) {
            return res.status(404).send('Property not found');
        }
        res.status(200).send('Property deleted successfully');
    } catch (error) {
        res.status(500).send(error.message);
    }
});

module.exports = router;
