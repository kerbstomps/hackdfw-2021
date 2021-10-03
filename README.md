<div align="center">
  <img src="https://media.discordapp.net/attachments/893537600672006144/894045972403986432/squarelogosmall.png" />
  <h1>Picture The World</h1>
  <h3><em>Connecting and educating people all over the world with pictures, language, and culture.</em></h3>
</div>

---

## HackDFW 2021
* [Devpost Link](https://devpost.com/software/picture-the-world)
* [HackDFW Site](https://hackdfw.com/)

## Inspiration
We wanted to create an interactive game that could represent different cultures and diversities by educating players with other languages and encouraging active engagement with learning.

## What it does
Each individual player, located anywhere in the world, can access the webapp and be presented with an image and a word. The image is a prompt that can be found in all cultures or countries, from prompts such as Family and Smile to objects like Fruit or Car. Along with this randomly chosen image, a translation of the word is given.

The key part of the program is that each image comes from another player, and each word is in the official language of the country that the image was taken in. This way, players can exchange cultures with other players and learn new words in other languages.

## How we built it
Our web app uses Node.js, React, and Gatsby.js for the frontend.
The backend uses Node.js, Express.js, and MongoDB for the database.
We implemented AWS S3 and AWS EC2 to host the server, and we used Amazon Rekognition to identify user-submitted photos through machine learning and match them across the database with specified parameters.

## Resources Used:
* https://github.com/yanivam/react-svg-worldmap
* https://github.com/lukes/ISO-3166-Countries-with-Regional-Codes
