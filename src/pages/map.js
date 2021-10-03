import * as React from "react";
import "./map.css";

import Layout from "../components/layout";
import Seo from "../components/seo";
import { ComposableMap, Geographies, Geography, Marker, ZoomableGroup } from "react-simple-maps";
import Button from "@mui/material/Button";
import { navigate } from "../../.cache/commonjs/gatsby-browser-entry";
import Typography from "@mui/material/Typography";

const geoUrl =
    "https://raw.githubusercontent.com/zcreativelabs/react-simple-maps/master/topojson-maps/world-110m.json";

const wordsToTranslate = [
    "Thanks for adding your image!",
    "Continue",
    "you",
    "Word Map"
];

const apiHost = "http://3.133.115.92:3000"

class MapPage extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            translatedWords: []
        }
    }

    componentDidMount() {
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
                        translatedWords: result.translated
                    });
                }

            } catch (error) {
                console.log(error);
            }
        }
    }

    render() {
        let { translatedWords } = this.state;

        const coordsList = this.props.location.state && this.props.location.state.coords;
        let countries = this.props.location.state && this.props.location.state.countries;

        let markers = [];
        if (coordsList && countries && translatedWords) {
            countries = [countries[0], countries[1] + `(${translatedWords[2]})`];

            markers = coordsList.map((coords, idx) => (
                {
                    markerOffset: -30,
                    name: countries[idx],
                    coordinates: coords
                }
            ));
        }

        return (coordsList && countries && markers && translatedWords ?
            <Layout>
                <Seo title="World map" />

                <Typography variant="h3" component="div" gutterBottom>{translatedWords[0]}</Typography>

                <Button sx={{marginBottom: "1.5em"}} onClick={() => navigate("/takepicture")} variant="contained">{translatedWords[1]}</Button>

                <Typography variant="h4" component="div">{translatedWords[3]}</Typography>
                <ComposableMap>
                    <ZoomableGroup zoom={1}>
                        <Geographies geography={geoUrl}>
                            {({ geographies }) =>
                                geographies
                                    .map(geo => (
                                        <Geography
                                            key={geo.rsmKey}
                                            geography={geo}
                                            fill="#EAEAEC"
                                            stroke="#D6D6DA"
                                        />
                                    ))
                            }
                        </Geographies>
                        {markers.map(({ name, coordinates, markerOffset }) => (
                            <Marker key={name} coordinates={coordinates}>
                                <g
                                    fill="none"
                                    stroke="#FF5533"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    transform="translate(-12, -24)"
                                >
                                    <circle cx="12" cy="10" r="3" />
                                    <path d="M12 21.7C17.3 17 20 13 20 10a8 8 0 1 0-16 0c0 3 2.7 6.9 8 11.7z" />
                                </g>
                                <text
                                    textAnchor="middle"
                                    y={markerOffset}
                                    style={{ fontFamily: "system-ui", fill: "#5D5A6D" }}
                                >
                                    {name}
                                </text>
                            </Marker>
                        ))}
                    </ZoomableGroup>
                </ComposableMap>
            </Layout>
            :
            <Layout>
                <Seo title="World map" />
            </Layout>
        )
    }

}

export default MapPage;
