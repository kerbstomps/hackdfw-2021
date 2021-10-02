module.exports = function(app, client) {

    app.get('/get_content', async (req, res) => {
        try {
            await client.connect();
            const db = client.db('data');
            const collection = db.collection('translations');
            const document = await collection.insertOne(/*stuff*/);
            return `${document.insertedId}`;
        } catch (error) {
            console.error(error);
            return `ERROR: ${error}`;
        } finally {
            await client.close();
        }
    });

    app.post('/send_content', async (req, res) => {
        // stuff here
    });

};