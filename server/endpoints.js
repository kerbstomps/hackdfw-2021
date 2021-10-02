module.exports = function(app, client) {

    app.get('/word', async (req, res) => {
        let nativeLanguage = req.query.nativeLanguage;
        try {
            await client.connect();
            const db = client.db('data');
            if (!db) 
                return new Error("Could not connect do database.");

            const collection = db.collection('translations');
            if (!collection) 
                return new Error("Collection does not exist");
            
            const documents = await collection.find({});
            if (!documents)
                return new Error("No data found.");
            
            const docArray = await documents.toArray();
            if (!docArray)
                return new Error("Could not parse documents into array.");
            
            const wordDoc = getRandomElement(docArray);
            if (!wordDoc)
                return new Error("Could not find random element in array.");
            
            const nativeWord = Object.entries(wordDoc.translations).filter((translation) => translation[0]===nativeLanguage)[0][1];
            if (!nativeWord)
                return new Error("Could not find native word in translations.");

            const foreignTranslations = Object.entries(wordDoc.translations).filter((translation) => translation[0]!==nativeLanguage);
            if (!foreignTranslations)
                return new Error("Could not find translations other than native language.");
            
            console.log(foreignTranslations);

            const randomForeignTranslation = getRandomElement(foreignTranslations);
            if (!randomForeignTranslation)
                return new Error("Could not find random foreign translation.");

            console.log(randomForeignTranslation);

            const randomForeignLanguage = randomForeignTranslation[0];
            const randomForeignWord = randomForeignTranslation[1];

            if (!wordDoc.images || !wordDoc.images[randomForeignLanguage])
                return new Error("Image info not found.");

            const imageInfo = getRandomElement(wordDoc.images[randomForeignLanguage]);

            if (!imageInfo)
                return new Error("Random image element not found.");

            console.log(imageInfo);
            
            res.json({
                photo: imageInfo.data, 
                location: imageInfo.location, 
                photagrapher: imageInfo.photagrapher, 
                nativeWord: nativeWord,
                foreignLanguage: randomForeignLanguage,
                foreignWord: randomForeignWord
            });

        } catch (error) {
            console.error(error);
            return `ERROR: ${error}`;
        } finally {
            await client.close();
        }
    });

    app.post('/content', async (req, res) => {
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

};

function getRandomElement(list) {
    return list[Math.floor(Math.random() * list.length)];
};