const express = require('express');
const { MongoClient } = require('mongodb');
var cors = require('cors');
var bodyParser = require('body-parser');
require('dotenv').config()

const app = express();

app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({limit: '50mb', extended: true}));
app.use(cors());

app.listen(3000);

// register endpoints
const endpoints = require('./endpoints.js');
const client = new MongoClient(process.env.DATABASE_URI);
endpoints(app, client, process.env.API_KEY);
