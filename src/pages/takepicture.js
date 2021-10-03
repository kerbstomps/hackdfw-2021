import * as React from "react";
import "./takepicture.css";

import Layout from "../components/layout";
import Seo from "../components/seo";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import CardMedia from "@mui/material/CardMedia";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import PersonIcon from "@mui/icons-material/Person";
import Button from "@mui/material/Button";
import {PhotoCamera} from "@mui/icons-material";
import CircularProgress from '@mui/material/CircularProgress';

import {
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    LinearProgress,
    Stack
} from "@mui/material";
import styled from "@emotion/styled";
import {Component} from "react";
import {navigate} from "../../.cache/commonjs/gatsby-browser-entry";
const langs = require("../data/languages.json");
const countryToCoords = require("../data/countryToCoords.json");
const countryCodeToCoords = require("../data/countryCodeToCoords.json");

const apiHost = "http://3.133.115.92:3000"
const photographer = "Adam";

const wordsToTranslate = [
    "An unexpected error occurred",
    "Retry",
    "Oh no!",
    "Your image was not recognized as a",
    "Try again",
    "Congratulations!",
    "Your image was uploaded and you gained",
    "points!",
    "Continue",
    "Look around you for",
    "Take or upload photo",
    "Finding an image..."
];

const Input = styled("input")({
    display: "none",
});

function getBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = function () {
            resolve(reader.result);
        };
        reader.onerror = function (error) {
            reject('Error: ', error);
        };
    });
}

class UploadedPicture extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isLoading: false
        };

        this.props = props;

        this.confirmUpload = this.confirmUpload.bind(this);
    }

    async confirmUpload  () {
        this.setState({isLoading: true});
        const location = (await (await fetch("http://ip-api.com/json")).json()).country;
        const dataUri = this.props.uploaded;
        const { nativeWord, awsIdentifier, id } = this.props;

        const lang = navigator.languages.filter(lang => lang.length === 2);

        const postBody = {
            location,
            imageData: dataUri,
            photographer,
            language: lang.length ? lang[0] : "",
            word: nativeWord,
            awsIdentifier: awsIdentifier,
            id
        };

        console.log("post body", postBody);

        const resp = await (await fetch(`${apiHost}/image?apiKey=hackdfw2021`, {
            method: 'POST',
            cache: 'no-cache',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(postBody)
        })).json();

        this.setState({isLoading: false});
        this.props.onUploadedImageResponse(resp);
    }

    render() {
        return (<>
            <Card className="card">
                <CardMedia
                    component="img"
                    image={this.props.uploaded}
                    alt="Uploaded image"
                    className="card-media"
                />
            </Card>
            <Button color="primary" aria-label="upload picture" component="span" variant="contained" onClick={this.confirmUpload}>Confirm Upload</Button>

            { this.state.isLoading && <CircularProgress />}
        </>);
    }
}

class TakePicture extends Component {
    constructor(props) {
        super(props);

        this.state = {
            uploadedImage: undefined,
            isLoaded: false,
            apiData: null,
            error: null,
            newPoints: null,
            validationFailure: false,
            name: props.location.state ? props.location.state.name : "Adam",
            points: props.location.state ? props.location.state.points : 0,
        };

        this.onUploadedImageResponse = this.onUploadedImageResponse.bind(this);
    }

    componentDidMount() {
        let { name } = this.state;

        this.updateData();
        this.translateWords(wordsToTranslate);
    }

    async translateWords(words) {
        if (words) {
          const fields = words.join('&str=');
          const lang = navigator.languages.filter(lang => lang.length === 2)[0];

          try {
            const result = await (await fetch(`${apiHost}/translate?to=${lang}&str=${fields}&apiKey=hackdfw2021`)).json();
            if (result) {
              this.setState({
                isLoaded: true,
                translatedWords: result.translated
              });
            }

          } catch(error) {
              console.log(error);
          }
        }
      }

    langCodeToLang(langCode) {
        const found = langs.find(x => x.code === langCode);
        return found ? found.description : null;
    }

    onUploadedImageResponse(response) {
        const { validated, points } = response;

        console.log(validated, points);

        if (validated) {
            this.setState({ newPoints: points });
        } else {
            this.setState({ validationFailure: true });
        }
    }

    async updateData() {
        try {
            const result = await (await fetch(`${apiHost}/word?nativeLanguage=en&apiKey=hackdfw2021`)).json();

            this.setState({
                apiData: result,
                uploadedImage: undefined
            });
        } catch (error) {
            this.setState({
                error
            });
        }
    }

    render() {
        const {error, isLoaded, apiData, validationFailure, newPoints, translatedWords } = this.state;
        const {foreignWord, foreignLanguage, location, photographer, photo, awsIdentifier, nativeWord, id} = apiData || {};
        const imageLocation = location;

        const foreignLanguageNatural = this.langCodeToLang(foreignLanguage);
        console.log(translatedWords);

        let isOpen = true;

        const imageUploaded = async (e) => {
            const elem = e.target;

            if (elem.files.length) {
                const uploadedImage = await getBase64(elem.files[0]);
                this.setState({ uploadedImage })
                console.log(uploadedImage);
            }
        };

        const handleClose = (e) => {
            this.updateData();
        };

        const takeNewPicture = async (wasSuccess) => {
            if(wasSuccess) {
                // this.setState({validationFailure: false, newPoints: null, isLoaded: false, uploadedImage: undefined});
                // this.updateData();

                const lad1 = countryToCoords[imageLocation][1];
                const long1 = countryToCoords[imageLocation][0];

                const myCountry = (await (await fetch("http://ip-api.com/json")).json()).country;
                const lad2 = countryToCoords[myCountry][1];
                const long2 = countryToCoords[myCountry][0];

                navigate("/map", {state: {coords: [[lad1, long1], [lad2, long2]], countries: [imageLocation, myCountry]}});
            }else{
                this.setState({validationFailure: false, newPoints: null, uploadedImage: undefined});
            }
        };

        if (error && isLoaded) {
            return (<Dialog
                open={isOpen}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    {translatedWords[0]}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        {error.stack.toString()}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} autoFocus>
                        {translatedWords[1]}
                    </Button>
                </DialogActions>
            </Dialog>);
        } else if (isLoaded) {

            return (<Layout>
                {validationFailure && <Dialog
                    open={isOpen}
                    onClose={() => takeNewPicture(false)}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogTitle id="alert-dialog-title">
                        {translatedWords[2]}
                    </DialogTitle>
                    <DialogContent>
                        <DialogContentText id="alert-dialog-description">
                            {translatedWords[3]} {nativeWord}!
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => takeNewPicture(false)} autoFocus>
                            {translatedWords[4]}
                        </Button>
                    </DialogActions>
                </Dialog>}

                {newPoints && <Dialog
                    open={isOpen}
                    onClose={() => takeNewPicture(true)}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogTitle id="alert-dialog-title">
                        {translatedWords[5]}
                    </DialogTitle>
                    <DialogContent>
                        <DialogContentText id="alert-dialog-description">
                            {translatedWords[6]} {newPoints} {translatedWords[7]}
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => takeNewPicture(true)} autoFocus>
                            {translatedWords[8]}
                        </Button>
                    </DialogActions>
                </Dialog>}

                <Seo title="Take a picture!" />
                <h1>{translatedWords[9]} <b>{foreignWord}</b> ({foreignLanguageNatural})</h1>

                <Stack direction="row" spacing={1}>
                    <Card sx={{ maxWidth: 300 }} className="card">
                        <CardMedia
                            component="img"
                            image={photo}
                            alt="user image"
                            className="card-media"
                        />
                        <CardContent>
                            <Stack alignItems="center"
                                direction="row" spacing={1}>
                                <PersonIcon /><Typography variant="body2"
                                    color="text.secondary">{photographer}</Typography>
                            </Stack>
                            <Stack alignItems="center"
                                direction="row" spacing={1}>
                                <LocationOnIcon /><Typography variant="body2"
                                    color="text.secondary">{location}</Typography>
                            </Stack>
                        </CardContent>
                    </Card>

                    <div>
                        <label htmlFor="icon-button-file">
                            <Input onChange={imageUploaded} accept="image/*" id="icon-button-file" type="file" />
                            <Button color="primary" aria-label="upload picture" component="span" variant="contained"
                                size="large" startIcon={<PhotoCamera />}>
                                {translatedWords[10]}
                            </Button>
                        </label>

                        {this.state.uploadedImage && <UploadedPicture uploaded={this.state.uploadedImage} nativeWord={nativeWord} awsIdentifier={awsIdentifier} id={id} onUploadedImageResponse={this.onUploadedImageResponse} />}
                    </div>
                </Stack>
            </Layout>
            );
        }
         else {
            return (<Layout>
                {/* <Typography variant="overline" display="block" gutterBottom>Finding an image...
                </Typography> */}
                <LinearProgress />
            </Layout>);
        }
    }
}


export default TakePicture;
