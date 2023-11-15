const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { ObjectId } = require('mongodb');
const db = require('../db');
const axios = require('axios');


const router = express.Router();

const cookieParser = require('cookie-parser');
router.use(cookieParser());

// Signup Route
router.post('/signup', async (req, res) => {
    console.log("Signup request");
    const usersCollection = db.getDB().collection("User");
    const { username, password, userType, email, phone, address, eKYCEmail, eKYCPassword } = req.body;
    try {
        data = {
            email: 'shantanu23140@iiitd.ac.in',
            password: 'donjub-jydKa4-fegsoc',
        }
        process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
        const kycResponse = await axios.post('https://192.168.3.39:5000/kyc', {
            email: eKYCEmail, 
            password: eKYCPassword
        });
        // console.log(JSON.stringify(kycResponse));
        if (kycResponse.data.status !== 'success' || kycResponse.data.message !== 'Login successful') {
            console.log('ekyc failed')
            return res.status(401).send('eKYC verification failed');
        }
    } catch (error) {
        
    // Optionally log more specific parts of the error
    // if (error.response) {
    //     // The request was made and the server responded with a status code
    //     // that falls out of the range of 2xx
    //     console.error(error.response.data);
    //     console.error(error.response.status);
    //     console.error(error.response.headers);
    // } else if (error.request) {
    //     // The request was made but no response was received
    //     console.error(error.request);
    // }

    return res.status(500).send('eKYC verification error');
}

    // Validate user type
    const validUserTypes = ['seller_renter', 'buyer_rentee']; 
    if (!validUserTypes.includes(userType)) {
        return res.status(400).send('Invalid user type');
    }

    //console.log(`User: ${username}, Password: ${password}, Type: ${userType}`);
    
    const hashedPassword = await bcrypt.hash(password, 10);
    const userDocument = {
        username,
        password: hashedPassword,
        userType,
        email,
        phone,
        address
    };

    try {
        await usersCollection.insertOne(userDocument);
        res.status(201).send('User created!');
    } catch (err) {
        res.status(500).send(err.message);
    }
});


// Login Route
router.post('/login', async (req, res) => {
    const usersCollection = db.getDB().collection("User");
    const { username, password } = req.body;

    try {
        const user = await usersCollection.findOne({ username });

        if (!user) {
            return res.status(404).send('User not found');
        }

        // Compare provided password with stored hashed password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        
        if (!isPasswordValid) {
            return res.status(401).send('Invalid credentials');
        }

        // Generate JWT token if authenticated
        const token = jwt.sign({ userId: user._id.toString() }, process.env.SECRET_KEY, {
            expiresIn: '1h'
        });

        // Set the JWT token as a cookie
        res.cookie('session_token', token, {
            httpOnly: true,
            // secure: true,  // remember to serve your app over HTTPS
            maxAge: 3600000 // 1 hour
        });

        //console.log("userId:" + user._id.toString())

        return res.json({
            message: 'Login successful',
            userId: user._id.toString(),
            user
        });

    } catch (error) {
        return res.status(500).send('Server error');
    }
});


// Update User Route
router.put('/:userId', async (req, res) => {
    const usersCollection = db.getDB().collection("User");

    const userIdFromParam = req.params.userId;

    // Assuming you send the JWT token in the header as Bearer token
    // const token = req.headers.authorization.split(" ")[1];
    const token = req.cookies.session_token;

    if (!token) {
        return res.status(401).send('Authentication token missing');
    }

    try {
        // Verify the JWT token and extract the user ID
        const payload = jwt.verify(token, process.env.SECRET_KEY);
        const userIdFromToken = payload.userId;

        // Fetch the user associated with the token
        const requestingUser = await usersCollection.findOne({ _id: ObjectId(userIdFromToken) });

        if (!requestingUser) {
            return res.status(404).send('Requesting user not found');
        }

        // If the user is not an admin and they're trying to update someone else's profile, deny the request
        if (requestingUser.userType !== 'admin' && userIdFromParam !== userIdFromToken) {
            return res.status(403).send('Unauthorized update attempt');
        }

        // Fetch the user to be updated
        const targetUser = await usersCollection.findOne({ _id: ObjectId(userIdFromParam) });

        if (!targetUser) {
            return res.status(404).send('Target user not found');
        }

        // Only allow updating certain fields (excluding username and password here for safety)
        const updatedData = {
            email: req.body.email || targetUser.email,
            phone: req.body.phone || targetUser.phone,
            address: req.body.address || targetUser.address,
            userType: req.body.userType || targetUser.userType
        };

        // Ensure the updated userType is valid
        const validUserTypes = ['seller_renter', 'buyer_rentee']; 
        if (!validUserTypes.includes(updatedData.userType)) {
            return res.status(400).send('Invalid user type update');
        }

        // Update user data in the collection
        await usersCollection.updateOne({ _id: ObjectId(userIdFromParam) }, { $set: updatedData });

        res.send('User updated successfully');
    } catch (error) {
        res.status(500).send(error.message);
    }
});

module.exports = router;
