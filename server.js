const express = require('express');
const MongoClient = require('mongodb').MongoClient;
const cors = require('cors');
const dotenv = require('dotenv');
const app = express();
const visitor = require('./visitor');
const endpoint = require('./endpoint');

// Dotenv Config
dotenv.config({
    path: './.env'
});

app.use(cors());
app.use(express.json());

// Routes
//app.use('/account', account);
app.use('/visitor', visitor);
app.use('/endpoint', endpoint);
//app.use('/consume', consume);

// Connection URL
const url = process.env.DB;
// Database Name
const dbName = 'trackable';
// New MongoClient
const client = new MongoClient(url, { useUnifiedTopology: true, useNewUrlParser: true });


const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`App is running on port ${PORT}`);
});