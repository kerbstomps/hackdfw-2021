const ObjectID = require('mongodb').ObjectID;
const getLabelsFromImage = require('./detectImage');
const translateString = require('./translate');

module.exports = function(app, client, apiKey) {

    app.use((req, res, next) => {
        if (apiKey === req.query.apiKey)
            next();
        else {
            res.status(403);
            res.json({ message: "Error: Could not authenticate request." });
        }
    });

    app.get('/word', async (req, res, next) => {
        let nativeLanguage = req.query.nativeLanguage;
        try {
            await client.connect();
            const db = client.db('data');

            if (!db)
                throw new Error("Could not connect do database.");

            const collection = db.collection('translations');
            if (!collection)
                throw new Error("Collection does not exist");

            const documents = await collection.find({});
            if (!documents)
                throw new Error("No data found.");

            const docArray = await documents.toArray();
            if (!docArray)
                throw new Error("Could not parse documents into array.");

            const wordDoc = getRandomElement(docArray);
            if (!wordDoc)
                throw new Error("Could not find random element in array.");

            const nativeTranslation = Object.entries(wordDoc.translations).filter((translation) => translation[0]===nativeLanguage)[0];
            if (!nativeTranslation)
                throw new Error("Could not find native translation in translations.");

            const nativeWord = nativeTranslation[1];
            if (!nativeWord)
                throw new Error("Could not find native word in translations.");

            const selectedImageAndLanguage = Object.entries(wordDoc.images).filter((thing) => thing[0]!==nativeLanguage)[0];
            if (!selectedImageAndLanguage)
                throw new Error("Could not find translations other than native language.");

            const selectedForeignLanguageCode = selectedImageAndLanguage[0];

            const foreignWord = wordDoc.translations[selectedForeignLanguageCode];
            if(!foreignWord){
                throw new Error("Could not find foreign word");
            }

            const foreignImagesList = selectedImageAndLanguage[1];

            if (!foreignImagesList) {
                throw new Error("Image info not found.");
            }

            const imageInfo = getRandomElement(foreignImagesList);

            if (!imageInfo)
                throw new Error("Random image element not found.");

            const awsId = wordDoc.awsIdentifier;
            if (!awsId)
                throw new Error("AWS Identifier not found.");

            console.log("responding with word doc", wordDoc);
            res.json({
                photo: imageInfo.data,
                location: imageInfo.location,
                photographer: imageInfo.photographer,
                nativeWord: nativeWord,
                foreignLanguage: selectedForeignLanguageCode,
                foreignWord,
                awsIdentifier: awsId,
                id: wordDoc._id
            });

        } catch (error) {
            console.error(error);
            res.status(500);
            res.json({ message: error.toString() });
        } finally {
            await client.close();
        }
    });

    app.post('/image', async (req, res, next) => {
        try {
            // req.body has imageData, location, photographer, language, word
            const { imageData, location, photographer, language, word, id } = req.body;

            const wordsDetected = await getLabelsFromImage(req.body.imageData);
            console.log(wordsDetected);

            await client.connect();
            const db = client.db('data');
            if (!db)
                return new Error("Could not connect do database.");

            const collection = db.collection('translations');
            if (!collection)
                return new Error("Collection does not exist");

            const document = await collection.findOne({ _id: new ObjectID(id) });

            if (document && document.translations[language] && wordsDetected.includes(document.awsIdentifier)) {
                document.images[language] = document.images[language] || [];
                document.images[language].push({
                    data: imageData,
                    location,
                    photographer
                });
                await collection.updateOne({_id: new ObjectID(id)}, { $set: { images: document.images } });

                return res.json({ validated: true, points: 100 });
            }
            res.json({ validated: false, points: 0});


        } catch (error) {
            console.error(error);
            res.status(500);
            res.json({ message: error.toString() });
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
            res.status(500);
            res.json({ message: error.toString() });
        } finally {
            await client.close();
        }
    });

    app.post('/user', async (req, res, next) => {
        await createNewUser(req, res);
    });

    app.get('/translate', async (req, res, next) => {
        const { str, to } = req.query;
        let translatedStrings = [];
        try {
            if (typeof str != "string"){
                const promises = str.map(element => {
                    const translatedString = translateString(to, element);
                    return translatedString;
    
                });
                translatedStrings = await Promise.all(promises);
            }
            else {
                translatedStrings.push(await translateString(to, str));
            }
            
        } catch (error) {
            res.status(500);
            return res.json({ message: error.toString() });
        }
        
        if (translatedStrings.length === 0) {
            res.status(500);
            return res.json({ message: "Error: Empty translated array." })
        }
        
        res.json({ translated: translatedStrings });
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
            res.status(500);
            res.json({ message: error.toString() });
        } finally {
            await client.close();
        }
    };
};


function getRandomElement(list) {
    return list[Math.floor(Math.random() * list.length)];
};
