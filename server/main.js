const express = require('express');
const { MongoClient } = require('mongodb');
var cors = require('cors');
require('dotenv').config()

const app = express();

app.use(express.urlencoded({extended: true})); 
app.use(express.json());

app.use(cors());
app.use(express.bodyParser({limit: '50mb'}));

app.listen(3000);

// register endpoints
const endpoints = require('./endpoints.js');
const client = new MongoClient(process.env.DATABASE_URI);
endpoints(app, client, process.env.API_KEY);