// routes/property.js
const express = require('express');
const PDFDocument = require('pdfkit');
const { ObjectId } = require('mongodb');
const db = require('../db');
const Property = require('../models/Property');
const multer = require('multer');
const upload = multer();
const streamBuffers = require('stream-buffers');
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
    //console.log(JSON.stringify(amenityList))// New attribute
    const amenities = {                               // New attribute
        pool: amenityList.pool === true,
        gym: amenityList.gym === true,
        wifi: amenityList.wifi === true
    };
    const owner = sellerId;
    const tenant = ""; 

    let imageUrl = "NA";

    try {
        if (req.file) {
            const result = await cloudinary.uploader.upload(`data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`, { resource_type: 'image' });
            imageUrl = result.url;
            //console.log(imageUrl);
        }
        //console.log(imageUrl);

        const property = new Property(title, description, price, sellerId, imageUrl, location, availabilityDate, amenities, 'NA', 'rent', owner, tenant);
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
    // ////console.log('seller params: ' + JSON.stringify(req.params));

    const { sellerId } = req.params;
    ////console.log('seller' + sellerId);
    const propertiesCollection = db.getDB().collection("Property");

    try {
        const properties = await propertiesCollection.find({ sellerId: sellerId }).toArray();
        ////console.log('Properties: ' + properties);
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

router.post('/submit-final-contract', async (req, res) => {
    //console.log('submit-final-contract')
    const { propertyId, finalContractText, contractType, sellerId, buyerId, tenant } = req.body;

    // if (!propertyId || !finalContractText || !contractType) {
    //     return res.status(400).send('Missing required data');
    // }

    const propertiesCollection = db.getDB().collection("Property");
    //console.log('loaded all properties');


    try {
        // Generate PDF
        const doc = new PDFDocument();
        const bufferStream = new streamBuffers.WritableStreamBuffer({
            initialSize: (100 * 1024),
            incrementAmount: (10 * 1024)
        });

        doc.pipe(bufferStream);
        doc.fontSize(12).text(finalContractText, {
            align: 'left'
        });
        doc.end();

        // //console.log('Final Contract Text:', finalContractText);

        // In the error handling of the stream
        bufferStream.on('error', err => {
            console.error('Stream error:', err);
            res.status(500).send('Error generating PDF');
        });

        bufferStream.on('finish', async () => {
            const pdfData = bufferStream.getContents().toString('base64');
            //console.log('generated pdf')
            // Upload to Cloudinary
            const result = await cloudinary.uploader.upload(`data:application/pdf;base64,${pdfData}`, { resource_type: 'raw' });
            const contractUrl = result.url;
            //console.log('contract URL: ' + contractUrl);

            let update = {
                $set: {
                    contractUrl: contractUrl,
                    status: contractType === 'purchase' ? 'sold' : 'rented',
                    // Update owner and tenant based on contract type
                    owner: contractType === 'purchase' ? buyerId : sellerId, // Update owner if sold
                    tenant: contractType === 'rent' ? buyerId : tenant // Update tenant if rented
                }
            };
            //console.log('contractType: ' + contractType);
            //console.log('buyerId: ' + buyerId);
            //console.log('sellerId: ' + sellerId);
            //console.log('tenant: ' + tenant);
            // Update property status in the database
            const updateResult = await propertiesCollection.updateOne({ _id: ObjectId(propertyId) }, update);

            if (updateResult.matchedCount === 0) {
                return res.status(404).send('Property not found');
            }

            res.status(200).send('Final contract submitted and uploaded successfully');
        });

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
    ////console.log('deleting property')
    const propertiesCollection = db.getDB().collection("Property");
    ////console.log('propertyId: ' + req.params.propertyId);

    // Ensure only the property owner can delete the listing
    const originalProperty = await propertiesCollection.findOne({ _id: ObjectId(req.params.propertyId) });
    ////console.log("property: ", originalProperty);
    ////console.log("originalSeller: ", originalProperty.sellerId);
    ////console.log("currentSeller: ", req.query);
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


// Get all contracts for a user
router.get('/user-contracts/:userId', async (req, res) => {
    const { userId } = req.params;
    const propertiesCollection = db.getDB().collection("Property");

    try {
        // Fetch properties where the user is either the seller or the buyer
        const contracts = await propertiesCollection.find({
            $or: [{ sellerId: userId }, { tenant: userId }, { owner: userId }]
        }).toArray();

        if (!contracts) {
            return res.status(404).send('No contracts found for this user');
        }

        res.status(200).json(contracts);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

module.exports = router;
