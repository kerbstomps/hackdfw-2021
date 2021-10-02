import * as React from "react"
import { Link } from "gatsby"
import "./takepicture.css"

import Layout from "../components/layout"
import Seo from "../components/seo"

const SecondPage = () => {
    const word = "un zapato";

    return (<Layout>
        <Seo title="Take a picture!" />
        <h1>Look around you for</h1>
        <blockquote id="word">{word}</blockquote>
        <input id="take-picture" type="file" accept="image/*"/>
        <button id="take-picture-btn"><span className="icon material-icons-outlined">photo_camera</span><span>Take picture or upload image</span></button>
    </Layout>);
};

export default SecondPage
