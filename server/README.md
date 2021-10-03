# API
## Authentication
Every request needs an `apiKey` parameter.
> `?apiKey=key`
## GET Word
```
GET /word?nativeLanguage=
-> 
{
  photo,
  location,
  photographer,
  nativeWord,
  foreignLanguage,
  foreignWord,
  awsIdentifier
}
```
## POST Image
```
POST /image
{
  imageData,
  location,
  photographer,
  language,
  word
}
-> 
{
  validated,
  points
}
```
## GET User
```
GET /user?name=
->
{
  _id,
  name,
  points
}
```
## POST User
```
POST /user?name=
->
{
  _id,
  name,
  points
}
```
