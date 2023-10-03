require('dotenv').config();
const express = require('express');
const cors = require('cors');
const db = require('./db');
const routes = require('./routes.js');

const app = express();
app.use(express.json()); 

const corsOptions = {
    origin: '*',
    credentials: true,
    optionSuccessStatus: 200,
};

app.use(cors(corsOptions));

// Initialize DB and then start server
db.connect().then(() => {
    app.use('/api', routes); // Prefix all routes with /api

    const port = 3001;
    app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
    });
}).catch(error => {
    console.error("Failed to connect to DB", error);
});

