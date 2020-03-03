const express = require("express");
const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
const dotenv = require('dotenv');
const router = express.Router();
const uuidv4 = require('uuid/v4');

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

//let template = `let test = (req) => { let object = {url: "https://enic23h1g656j.x.pipedream.net/", body: req};return object;}; test(req);`

router.post('/', (req, res) => {
    client.connect((err) => {
        assert.equal(null, err);
        console.log("Connected to the server");

        const db = client.db(dbName);
        const visitors = db.collection("Visitors");

        let method = req.body.method ? req.body.method : "POST";

        let endpoint = {
            "url": uuidv4(),
            "content": req.body.content,
            method
        }

        if (req.body.account) {
            res.send(`Adding endpoints to Accounts hasn't been implemented yet.`)
        } else if (req.body.id) {
            try {
                visitors.updateOne(
                    { "id": req.body.id },
                    { $push: { endpoints: endpoint } }
                )
                res.send(`Created endpoint ${endpoint.url}`)
            } catch (err) {
                console.log(err.message);
                res.send(err.message);
            }
        } else {
            res.status(409);
            res.send(`No ID or Account specified.`);
        }
    })
})

module.exports = router;