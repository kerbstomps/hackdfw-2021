import * as React from "react";
import "./map.css";

import Layout from "../components/layout";
import Seo from "../components/seo";
import {ComposableMap, Geographies, Geography, Marker, ZoomableGroup} from "react-simple-maps";
import Button from "@mui/material/Button";
import {navigate} from "../../.cache/commonjs/gatsby-browser-entry";
import Typography from "@mui/material/Typography";

const geoUrl =
    "https://raw.githubusercontent.com/zcreativelabs/react-simple-maps/master/topojson-maps/world-110m.json";

const MapPage = (props) => {
    const coordsList = props.location.state && props.location.state.coords;
    let countries = props.location.state && props.location.state.countries;

    if(coordsList && countries) {
        countries = [countries[0], countries[1] + " (you)"];

        const markers = coordsList.map((coords, idx) => (
            {
                markerOffset: -30,
                name: countries[idx],
                coordinates: coords
            }
        ));
        console.log("coodsList", coordsList, "markers", markers);


        return (<Layout>
            <Seo title="World map"/>

            <Typography variant="h3" component="div" gutterBottom>Thanks for adding your image!</Typography>
            <ComposableMap>
                <ZoomableGroup zoom={1}>
                    <Geographies geography={geoUrl}>
                        {({geographies}) =>
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
                    {markers.map(({name, coordinates, markerOffset}) => (
                        <Marker key={name} coordinates={coordinates}>
                            <g
                                fill="none"
                                stroke="#FF5533"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                transform="translate(-12, -24)"
                            >
                                <circle cx="12" cy="10" r="3"/>
                                <path d="M12 21.7C17.3 17 20 13 20 10a8 8 0 1 0-16 0c0 3 2.7 6.9 8 11.7z"/>
                            </g>
                            <text
                                textAnchor="middle"
                                y={markerOffset}
                                style={{fontFamily: "system-ui", fill: "#5D5A6D"}}
                            >
                                {name}
                            </text>
                        </Marker>
                    ))}
                </ZoomableGroup>
            </ComposableMap>
            <Button onClick={() => navigate("/takepicture")} variant="contained">Continue</Button>
        </Layout>);
    }else{
        return (<Layout>
            <Seo title="World map"/>
        </Layout>);
    }
};

export default MapPage;
