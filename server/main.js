const express = require('express');
const app = express();

app.use(express.urlencoded({extended: true})); 
app.use(express.json());

// register endpoints
const endpoints = require('./endpoints.js');
endpoints(app);

