// routes/property.js
const express = require('express');
const { ObjectId } = require('mongodb');
const db = require('../db');
const Property = require('../models/Property');

const router = express.Router();

// Create a new property listing
router.post('/list', async (req, res) => {
    const propertiesCollection = db.getDB().collection("Property");
    const { title, description, price, sellerId, images } = req.body;

    const property = new Property(title, description, price, sellerId, images);

    try {
        await propertiesCollection.insertOne(property);
        res.status(201).send('Property listed successfully!');
    } catch (err) {
        res.status(500).send(err.message);
    }
});

// Get all properties
router.get('/', async (req, res) => {
    const propertiesCollection = db.getDB().collection("Property");

    try {
        const properties = await propertiesCollection.find({}).toArray();
        res.json(properties);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

// Get a specific property by ID
router.get('/:propertyId', async (req, res) => {
    const propertiesCollection = db.getDB().collection("Property");

    try {
        const property = await propertiesCollection.findOne({ _id: ObjectId(req.params.propertyId) });
        if (!property) {
            return res.status(404).send('Property not found');
        }
        res.status(200).json(property);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

// Update a property by ID
router.put('/:propertyId', async (req, res) => {
    const propertiesCollection = db.getDB().collection("Property");

    const updatedData = {
        title: req.body.title,
        description: req.body.description,
        price: req.body.price,
        images: req.body.images
    };

    try {
        const result = await propertiesCollection.updateOne({ _id: ObjectId(req.params.propertyId) }, { $set: updatedData });
        if (result.matchedCount === 0) {
            return res.status(404).send('Property not found');
        }
        res.status(200).send('Property updated successfully');
    } catch (err) {
        res.status(500).send(err.message);
    }
});

// Delete a property by ID
router.delete('/:propertyId', async (req, res) => {
    const propertiesCollection = db.getDB().collection("Property");

    try {
        const result = await propertiesCollection.deleteOne({ _id: ObjectId(req.params.propertyId) });
        if (result.deletedCount === 0) {
            return res.status(404).send('Property not found');
        }
        res.status(200).send('Property deleted successfully');
    } catch (err) {
        res.status(500).send(err.message);
    }
});

module.exports = router;
