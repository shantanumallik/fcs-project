// routes/property.js
const express = require('express');
const { ObjectId } = require('mongodb');
const db = require('../db');
const Property = require('../models/Property');
const multer = require('multer');
const upload = multer();

const router = express.Router();

// Create a new property listing
router.post('/list', upload.single('image'), async (req, res) => {
    const propertiesCollection = db.getDB().collection("Property");

    // Extracting fields from the form data
    const title = req.body.title;
    const description = req.body.description;
    const price = req.body.price;
    const sellerId = req.body.sellerId;

    // Assuming you want to store the image as a base64 string. This is not efficient for large-scale applications.
    // Consider storing images on cloud storage like AWS S3 and saving the URL in the database.
    const image = req.file ? req.file.buffer.toString('base64') : null;
    
    const property = new Property(title, description, price, sellerId, image ? [image] : []);

    try {
        await propertiesCollection.insertOne(property);
        res.status(201).send('Property listed successfully!');
    } catch (err) {
        res.status(500).send(err.message);
    }
});
// Get all properties listed by a specific seller
router.get('/seller/:sellerId', async (req, res) => {
    console.log('seller params: ' + JSON.stringify(req.params));

    const { sellerId } = req.params;
    console.log('seller' + sellerId);
    const propertiesCollection = db.getDB().collection("Property");

    try {
        const properties = await propertiesCollection.find({ sellerId: sellerId }).toArray();
        console.log('Properties: ' + properties);
        res.json(properties);
    } catch (error) {
        res.status(500).send("Server error");
    }
});

// Get all properties
router.get('/', async (req, res) => {
    console.log('here')
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

    // Ensure only the property owner can modify the listing
    const originalProperty = await propertiesCollection.findOne({ _id: ObjectId(req.params.propertyId) });
    if (originalProperty.sellerId !== req.body.sellerId) {
        return res.status(403).send('You do not have permission to modify this property');
    }

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
    console.log('propertyId: ' + req.params.propertyId);

    // Ensure only the property owner can delete the listing
    const originalProperty = await propertiesCollection.findOne({ _id: ObjectId(req.params.propertyId) });
    console.log("property: ", originalProperty);
    console.log("originalSeller: ", originalProperty.sellerId);
    console.log("currentSeller: ", req.query);
    if (originalProperty.sellerId !== req.query.sellerId) {
        return res.status(403).send('You do not have permission to delete this property');
    }

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
