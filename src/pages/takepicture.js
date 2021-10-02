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
import {Stack} from "@mui/material";
import styled from "@emotion/styled";
import {Component} from "react";
import { navigate } from "gatsby"


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
    console.log(props);

    const confirmUpload = () => {
        console.log(props.uploaded);
        navigate("/map");
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
            uploadedImage: undefined
        };
    }


    render() {
        const word = "un zapato";
        const photographer = "Steve";
        const location = "Somewhere";
        const src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEsAAABLCAIAAAC3LO29AAABhGlDQ1BJQ0MgcHJvZmlsZQAAKJF9kT1Iw0AcxV9TRSkVBTuIOGSoThbELxy1CkWoEGqFVh1MLv2CJg1Jiouj4Fpw8GOx6uDirKuDqyAIfoC4uTkpukiJ/0sKLWI8OO7Hu3uPu3eAUC8zzeoYAzTdNlOJuJjJropdrwhBQB9imJKZZcxJUhK+4+seAb7exXiW/7k/R4+asxgQEIlnmWHaxBvE05u2wXmfOMKKskp8Tjxq0gWJH7muePzGueCywDMjZjo1TxwhFgttrLQxK5oa8SRxVNV0yhcyHquctzhr5Spr3pO/MJzTV5a5TnMICSxiCRJEKKiihDJs6qsEnRQLKdqP+/gHXb9ELoVcJTByLKACDbLrB/+D391a+YlxLykcBzpfHOdjGOjaBRo1x/k+dpzGCRB8Bq70lr9SB2Y+Sa+1tOgR0LsNXFy3NGUPuNwBBp4M2ZRdKUhTyOeB9zP6pizQfwuE1rzemvs4fQDS1FXyBjg4BEYKlL3u8+7u9t7+PdPs7wenInK8muCaHAAAAAlwSFlzAAAuIwAALiMBeKU/dgAAAAd0SU1FB+UKAhAxOwGUvV0AAAAZdEVYdENvbW1lbnQAQ3JlYXRlZCB3aXRoIEdJTVBXgQ4XAAAAXElEQVR42u3PAQ0AAAgDoGv/ztrjgwbMpdzG0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQsM8Dn84BlefWENIAAAAASUVORK5CYII=";

        const imageUploaded = async (e) => {
            const elem = e.target;

            if(elem.files.length) {
                const uploadedImage = await getBase64(elem.files[0]);
                this.setState({uploadedImage})
                console.log(uploadedImage);
            }
        };

        return (<Layout>
            <Seo title="Take a picture!"/>
            <h1>Look around you for</h1>
            <blockquote id="word">{word}</blockquote>

            <Stack direction="row" spacing={1}>
                <Card sx={{maxWidth: 300}} className="card">
                    <CardMedia
                        component="img"
                        image={src}
                        alt="user image"
                        className="card-media"
                    />
                    <CardContent>
                        <Stack alignItems="center"
                               direction="row" spacing={1}>
                            <LocationOnIcon/><Typography variant="body2" color="text.secondary">By {photographer} in {location}</Typography>
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

                    { this.state.uploadedImage && <UploadedPicture uploaded={this.state.uploadedImage}/>}
                </div>
            </Stack>
        </Layout>);
    }
}

export default TakePicture;
