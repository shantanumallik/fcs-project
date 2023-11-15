// routes/property.js
const express = require('express');
const { ObjectId } = require('mongodb');
const db = require('../db');
const Property = require('../models/Property');
const multer = require('multer');
const upload = multer();
const cloudinary = require('cloudinary').v2;
cloudinary.config({ 
    cloud_name: 'dokrcy8vd', 
    api_key: '619359627939352', 
    api_secret: 'McaRxijFapspkNWv17JGpVnUMqk' 
});

const router = express.Router();

// Create a new property listing
router.post('/list', upload.single('image'), async (req, res) => {
    const propertiesCollection = db.getDB().collection("Property");
    const title = req.body.title;
    const description = req.body.description;
    const price = req.body.price;
    const sellerId = req.body.sellerId;
    const location = req.body.location;               // New attribute
    const availabilityDate = req.body.availabilityDate;
    const amenityList = JSON.parse(req.body.amenities); 
    console.log(JSON.stringify(amenityList))// New attribute
    const amenities = {                               // New attribute
        pool: amenityList.pool === true,
        gym: amenityList.gym === true,
        wifi: amenityList.wifi === true
    };

    let imageUrl = "NA";

    try {
        if (req.file) {
            const result = await cloudinary.uploader.upload(`data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`, { resource_type: 'image' });
            imageUrl = result.url;
            console.log(imageUrl);
        }
        console.log(imageUrl);

        const property = new Property(title, description, price, sellerId, imageUrl, location, availabilityDate, amenities);
        await propertiesCollection.insertOne(property);
        res.status(201).send('Property listed successfully!');

    } catch (error) {
        if (error.message && error.message.includes("Failed to upload image to Cloudinary")) {
            res.status(500).send(error.message);
        } else {
            res.status(500).send('Internal Server Error');
        }
    }
});

// Get all properties listed by a specific seller
router.get('/seller/:sellerId', async (req, res) => {
    // //console.log('seller params: ' + JSON.stringify(req.params));

    const { sellerId } = req.params;
    //console.log('seller' + sellerId);
    const propertiesCollection = db.getDB().collection("Property");

    try {
        const properties = await propertiesCollection.find({ sellerId: sellerId }).toArray();
        //console.log('Properties: ' + properties);
        res.json(properties);
    } catch (error) {
        res.status(500).send("Server error");
    }
});

// Add to your existing property.js file

// POST route to generate a rental contract
router.post('/generate-contract', async (req, res) => {
    const { propertyId, sellerId, buyerId, rentalTerms } = req.body;

    // Basic validation
    if (!propertyId || !sellerId || !buyerId || !rentalTerms) {
        return res.status(400).send('Missing required contract details');
    }

    // Generate contract text
    const contractText = `Rental Contract
-------------------------
Property ID: ${propertyId}
Seller ID: ${sellerId}
Buyer ID: ${buyerId}

Rental Terms:
${rentalTerms}

This contract is legally binding and signifies an agreement between the buyer and seller of the property.

Signed:
Seller: ____________________
Buyer: ____________________
`;

    // Send the contract text to the frontend
    res.status(200).json({ contractText });
});

rrouter.post('/submit-final-contract', async (req, res) => {
    const { propertyId, finalContractText, contractType } = req.body; // include contractType to determine if it's a rental or a purchase

    if (!propertyId || !finalContractText || !contractType) {
        return res.status(400).send('Missing property ID, contract text, or contract type');
    }

    const propertiesCollection = db.getDB().collection("Property");

    try {
        let update = { 
            $set: { 
                finalContractText: finalContractText,
                status: contractType === 'purchase' ? 'sold' : 'rented'
            } 
        };

        if (contractType !== 'purchase') {
            // For rental, update availabilityDate to a future date when it becomes available again
            update.$set.availabilityDate = new Date(/* set your future date here */);
        }

        const result = await propertiesCollection.updateOne({ _id: ObjectId(propertyId) }, update);

        if (result.matchedCount === 0) {
            return res.status(404).send('Property not found');
        }

        res.status(200).send('Final contract submitted successfully');
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

    const { sellerId, title, description, price, images } = req.body;

    // Fetch the original property from the database
    const originalProperty = await propertiesCollection.findOne({ _id: ObjectId(req.params.propertyId) });

    if (!originalProperty) {
        return res.status(404).send('Property not found');
    }

    // Ensure only the property owner can modify the listing
    if (originalProperty.sellerId !== sellerId) {
        return res.status(403).send('You do not have permission to modify this property');
    }

    // Prepare updated data for the property
    const updatedData = {
        title,
        description,
        price,
        images
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
router.delete('/delete/:propertyId', async (req, res) => {
    //console.log('deleting property')
    const propertiesCollection = db.getDB().collection("Property");
    //console.log('propertyId: ' + req.params.propertyId);

    // Ensure only the property owner can delete the listing
    const originalProperty = await propertiesCollection.findOne({ _id: ObjectId(req.params.propertyId) });
    //console.log("property: ", originalProperty);
    //console.log("originalSeller: ", originalProperty.sellerId);
    //console.log("currentSeller: ", req.query);
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
