const AWS = require('aws-sdk');
AWS.config.update({region:'us-east-2'});
const rekognition = new AWS.Rekognition({apiVersion: '2016-06-27'});

const getLabelsFromImage = async (base64Url) => {
    const base64Image = base64Url.replace(/^data:image\/(png|jpeg|jpg);base64,/, '');

    const opts = {
        Image: {
            Bytes: Buffer.from(base64Image, "base64")
        },
        MaxLabels: 10,
        MinConfidence: .40
    };
    const request = await rekognition.detectLabels(opts);
    const response = await request.promise();

    return response.Labels.map(label => label.Name);
};

module.exports = getLabelsFromImage;