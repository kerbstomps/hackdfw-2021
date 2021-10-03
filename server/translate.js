const AWS = require('aws-sdk');
AWS.config.update({region:'us-east-2'});
const awsTranslate = new AWS.Translate();

const translateString = async (langTo, text) => {
    const params = {
        SourceLanguageCode: 'en',
        TargetLanguageCode: langTo,
        Text: text,
        TerminologyNames: []
    }
    try {
        const translation = await awsTranslate.translateText(params).promise();
        return translation.TranslatedText;
    } catch (error) {
        return false;
    }
};

module.exports = translateString;