const express = require("express");
const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
const dotenv = require('dotenv');
const router = express.Router();

const axios = require('axios');

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

router.post('/:url', (req, res) => {
    console.log("test");
    client.connect((err) => {
        assert.equal(null, err);
        console.log("Connected to the server");

        // object.body should be an object like this:
        //{
        //  "item": "value",
        //  "item": "value"
        //}

        let theFunction = "let req = " + JSON.stringify(req.body) + ";";

        const db = client.db(dbName);
        const endpoints = db.collection("Visitors");

        endpoints.find({ 'endpoints.url': req.params.url }).toArray((err, docs) => {
            console.log(docs);
            if (docs.length > 0) {
                let doc = docs[0];
                let endpoint;
                for (let i = 0; i < doc.endpoints.length; i++) {
                    if (doc.endpoints[i].url === req.params.url) {
                        endpoint = doc.endpoints[i];
                    }
                }
                let test = endpoint.content;
                console.log(test);
                theFunction += "" + test;
                console.log(theFunction);
                let object;

                try {
                    object = eval(theFunction);
                } catch (err) {
                    console.log(err);
                }

                if (object.method === "POST") {
                    try {
                        console.log("posting");
                        console.log("object", object);
                        axios.post(object.url, object.body)
                            .then(function (response) {
                                //console.log(response);
                                if (response.status === 200) {
                                    // console.log(response.data);
                                    return true;
                                } else {
                                    console.log(response);
                                    return false;
                                }
                            })
                            .catch(function (error) {
                                console.log(error);
                                return false;
                            });
                    } catch (err) {
                        console.log(err);
                    }
                } else if (object.method === "GET") {
                    try {
                        console.log("getting");
                        console.log("object", object);
                        axios.get(object.url)
                            .then(function (response) {
                                //console.log(response);
                                if (response.status === 200) {
                                    // console.log(response.data);
                                    return true;
                                } else {
                                    console.log(response);
                                    return false;
                                }
                            })
                            .catch(function (error) {
                                console.log(error);
                                return false;
                            });
                    } catch (err) {
                        console.log(err);
                    }
                }


            } else {
                res.send("No endpoints found with that url");
            }
        })
        res.send("done");
    })
})

module.exports = router;