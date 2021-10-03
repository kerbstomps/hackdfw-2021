import * as React from "react";
import "./takepicture.css";

import Layout from "../components/layout";
import Seo from "../components/seo";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import CardMedia from "@mui/material/CardMedia";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import Button from "@mui/material/Button";
import {PhotoCamera} from "@mui/icons-material";
import {Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Stack} from "@mui/material";
import styled from "@emotion/styled";
import {Component} from "react";
import { navigate } from "gatsby"
const langs = require("../data/languages.json");

const photographer = "Adam";


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

const UploadedPicture = (props) => {
    const confirmUpload = async () => {
        const location = (await (await fetch("http://ip-api.com/json")).json()).country;
        const dataUri = props.uploaded;
        const {nativeWord, awsIdentifier, id} = props;

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

        const resp = await (await fetch("http://localhost:3000/image?apiKey=hackdfw2021", {
            method: 'POST',
            cache: 'no-cache',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(postBody)
        })).json();

        console.log("got resp", resp);
    };
    return (<>
        <Card sx={{maxWidth: 300}} className="card">
        <CardMedia
            component="img"
            image={props.uploaded}
            alt="Uploaded image"
            className="card-media"
        />
    </Card>
    <Button color="primary" aria-label="upload picture" component="span" variant="contained" onClick={confirmUpload}>Confirm Upload</Button>
    </>);
};

class TakePicture extends Component {
    constructor(props) {
        super(props);

        this.state = {
            uploadedImage: undefined,
            isLoaded: false,
            apiData: null,
            error: null
        };
    }


    componentDidMount(){
        this.updateData();
    }

    langCodeToLang(langCode){
        const found = langs.find(x=>x.code === langCode);
        return found ? found.description : null;
    }

    async updateData() {
        try {
            const result = await (await fetch("http://localhost:3000/word?nativeLanguage=en&apiKey=hackdfw2021")).json();

            this.setState({
                isLoaded: true,
                apiData: result
            });
        }catch(error) {
            this.setState({
                isLoaded: true,
                error
            });
        }
    }

    render() {
        const {error, isLoaded, apiData} = this.state;
        const {foreignWord, foreignLanguage, location, photographer, photo, awsIdentifier, nativeWord, id} = apiData || {};

        const foreignLanguageNatural = this.langCodeToLang(foreignLanguage);

        let isOpen = true;

        const imageUploaded = async (e) => {
            const elem = e.target;

            if(elem.files.length) {
                const uploadedImage = await getBase64(elem.files[0]);
                this.setState({uploadedImage})
                console.log(uploadedImage);
            }
        };

        const handleClose = (e) => {
            console.log(e);
            this.updateData();
        };

        if(error) {
            return (<Dialog
                open={isOpen}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    {"An unexpected error occurred"}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        {error.stack.toString()}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} autoFocus>
                        Retry
                    </Button>
                </DialogActions>
            </Dialog>);
        }else if(isLoaded) {
            console.log(nativeWord);
            return (<Layout>
                <Seo title="Take a picture!"/>
                <h1>Look around you for {nativeWord}</h1>
                <blockquote id="word">{foreignWord} ({foreignLanguageNatural})</blockquote>

                <Stack direction="row" spacing={1}>
                    <Card sx={{maxWidth: 300}} className="card">
                        <CardMedia
                            component="img"
                            image={photo}
                            alt="user image"
                            className="card-media"
                        />
                        <CardContent>
                            <Stack alignItems="center"
                                   direction="row" spacing={1}>
                                <LocationOnIcon/><Typography variant="body2"
                                                             color="text.secondary">By {photographer} in {location}</Typography>
                            </Stack>
                        </CardContent>
                    </Card>

                    <div>
                        <label htmlFor="icon-button-file">
                            <Input onChange={imageUploaded} accept="image/*" id="icon-button-file" type="file"/>
                            <Button color="primary" aria-label="upload picture" component="span" variant="contained"
                                    size="large" startIcon={<PhotoCamera/>}>
                                Take or upload photo
                            </Button>
                        </label>


                        {this.state.uploadedImage && <UploadedPicture uploaded={this.state.uploadedImage} nativeWord={nativeWord} awsIdentifier={awsIdentifier} id={id}/>}
                    </div>
                </Stack>
            </Layout>);
        }else{
            return (<div>Loading...</div>);
        }
    }
}

export default TakePicture;
