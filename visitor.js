const express = require("express");
const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
const dotenv = require('dotenv');
const router = express.Router();

dotenv.config({
    path: './.env'
});

dotenv.config({
    path: './.env'
});

// Connection URL
const url = process.env.DB;
// Database Name
const dbName = 'endpoints';
// New MongoClient
const client = new MongoClient(url, { useUnifiedTopology: true, useNewUrlParser: true })

// EXPRESS VERSION
router.use((req, res, next) => {
    console.log(req.method + " to " + req.baseUrl + ".");
    next();
})

// POST - Create Visitor
router.post('/', (req, res) => {
    if (req.body.id) {
        let id = req.body.id;

        let newVisitor = {
            "id": id,
            "endpoints": []
        }

        client.connect(function (err) {
            assert.equal(null, err);
            console.log("Connected to the server");

            const db = client.db(dbName);
            const collection = db.collection('Visitors');

            try {
                collection.find({ id }).toArray(function (err, docs) {
                    // Check if ID already exists
                    if (docs.length > 0) {
                        res.status(509);
                        return res.send(`Visitor with this ID already exists.`);
                    } else {
                        collection.insertOne(newVisitor)
                            .then(res => console.log(`Successfully inserted item with _id: ${id}`))
                            .catch(err => console.error(`Failed to insert item: ${err}`))
                        return res.send(`Created: ${id}`);
                    }
                })
            } catch (err) {
                console.log(err.message);
                res.status(409);
                res.send(err.message);
            }
        });

    }
    else {
        res.status(509);
        res.send(`Missing ID.`);
    }
})

// GET - Return Visitor Endpoints
router.get('/:id', (req, res) => {
    if (req.params.id) {
        let id = req.params.id;

        client.connect(function (err) {
            assert.equal(null, err);
            console.log("Connected to the server");

            const db = client.db(dbName);
            const collection = db.collection('Visitors');

            try {
                collection.find({ id }).toArray(function (err, docs) {
                    // Check if ID already exists
                    if (docs.length > 0) {
                        return res.send(docs[0].endpoints);
                    } else {
                        res.status(204);
                        return res.send(`Could not find Visitor with ID ${id}`);
                    }
                })
            } catch (err) {
                console.log(err.message);
                res.status(409);
                res.send(err.message);
            }
        });

    }
    else {
        res.status(204);
        res.send(`Missing ID.`);
    }
})

module.exports = router;
