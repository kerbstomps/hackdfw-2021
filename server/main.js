const express = require('express');
const { MongoClient } = require('mongodb');
require('dotenv').config()

const app = express();

app.use(express.urlencoded({extended: true})); 
app.use(express.json());

// register endpoints
const endpoints = require('./endpoints.js');
endpoints(app);

const dbClient = new MongoClient(process.env.DATABASE_URI);

async function test (message) {
    try {
        await dbClient.connect();
        const db = dbClient.db('test');
        const collection = db.collection(message);
        let data = {
            'sender': 'test',
            'message': 'test'
        }
        const document = await collection.insertOne(data);
        return `${document.insertedId}`;
    } catch (error) {
        console.error(error);
        return `ERROR: ${error}`;
    } finally {
        await dbClient.close();
    }
}

test('hi');