const { MongoClient } = require('mongodb');

const uri = process.env.DB_CONNECTION_STRING;

let _db;

async function connect() {
    const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    await client.connect();

    _db = client.db(process.env.DB_NAME); // Replace 'YOUR_DB_NAME' if you want to source this from .env as well
    //console.log("Connected successfully");
}

function getDB() {
    return _db;
}

module.exports = { connect, getDB };
