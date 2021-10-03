module.exports = function(app, client, apiKey) {
    const getLabelsFromImage = require('./detectImage');

    app.use((req, res, next) => {
        if (apiKey === req.query.apiKey)
            next();
        else
            res.send("ERROR: Could not authenticate request.");
    });

    app.get('/word', async (req, res, next) => {
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

            const randomForeignTranslation = getRandomElement(foreignTranslations);
            if (!randomForeignTranslation)
                return new Error("Could not find random foreign translation.");

            const randomForeignLanguage = randomForeignTranslation[0];
            const randomForeignWord = randomForeignTranslation[1];

            if (!wordDoc.images || !wordDoc.images[randomForeignLanguage])
                return new Error("Image info not found.");

            const imageInfo = getRandomElement(wordDoc.images[randomForeignLanguage]);

            if (!imageInfo)
                return new Error("Random image element not found.");
            
            const awsId = wordDoc.awsIdentifier;
            if (!awsId)
                return new Error("AWS Identifier not found.");

            console.log(wordDoc);
            res.json({
                photo: imageInfo.data, 
                location: imageInfo.location, 
                photagrapher: imageInfo.photagrapher, 
                nativeWord: nativeWord,
                foreignLanguage: randomForeignLanguage,
                foreignWord: randomForeignWord,
                awsIdentifier: awsId
            });

        } catch (error) {
            console.error(error);
            res.send(`ERROR: ${error}`);
        } finally {
            await client.close();
        }
    });

    app.post('/image', async (req, res, next) => {
        try {
            // req.body has imageData, location, photographer, language, word
            const { imageData, location, photographer, language, word } = req.body;
        
            const wordsDetected = await getLabelsFromImage(req.body.imageData);
            console.log(wordsDetected);

            await client.connect();
            const db = client.db('data');
            if (!db) 
                return new Error("Could not connect do database.");

            const collection = db.collection('translations');
            if (!collection) 
                return new Error("Collection does not exist");
            
            const document = await collection.findOne({awsIdentifier: {$in: wordsDetected}});
            if (!document)
                return res.json({ validated: false, points: 0});
            
            console.log(document);

            document.images[language] = document.images[language] || [];
            document.images[language].push({
                data: imageData,
                location,
                photographer
            });
            
            await collection.updateOne({awsIdentifier: {$in: wordsDetected}}, { $set: { images: document.images } });
            
            res.json({ validated: true, points: 100 });

            
        } catch (error) {
            console.error(error);
            return `ERROR: ${error}`;
        } finally {
            await client.close();
        }
    });
    
    app.get('/user', async(req, res, next) => {
        try {
            await client.connect();
            const db = client.db('data');
            let user = await db.collection('users').findOne({ name: req.query.name });
            if (!user)
                user = await createNewUser(req, res);
            
            res.json(user);
    
        } catch (error) {
            console.error(error);
            res.send(`ERROR: ${error}`);
        } finally {
            await client.close();
        }
    });
    
    app.post('/user', async (req, res, next) => {
        await createNewUser(req, res);
    });

    async function createNewUser(req, res) {
        try {
            await client.connect();
            const db = client.db('data');
            await db.collection('users').insertOne({ name: req.query.name, points: 0});
            console.log(req.query.name + " succesfully added to users.");
            return await db.collection('users').findOne( {name: req.query.name });
    
        } catch (error) {
            console.error(error);
            res.send(`ERROR: ${error}`);
        } finally {
            await client.close();
        }
    };
};


function getRandomElement(list) {
    return list[Math.floor(Math.random() * list.length)];
};