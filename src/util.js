import React from "react";
import {Circle, Popup} from "react-leaflet"; //tools from leaflet
import numeral from "numeral";
// import { popup } from "leaflet";

//circle dictionary with 3 keys:
const casesTypeColors = {
    cases: {
        hex:"#CC1034",
        // rgb: "rgb(204, 16, 52)",
        // half_op: "rgba(204, 16, 52, 0.5)",
        multiplier: 800,
    },
    recovered: {
        hex:"#7dd71d",
        // rgb: "rgb(125, 215, 29)",
        // half_op: "rgba(125, 215, 29, 0.5)",
        multiplier: 1200,
    },
    deaths: {
        hex:"#CC1034",
        // rgb: "rgb(125, 68, 67)",
        // half_op: "rgba(251, 68, 67, 0.5)",
        multiplier: 2000,
    },
};

//sorting countries by number of cases
export const sortData = (data) => {
    const sortedData = [...data];

    sortedData.sort((a, b) => {
        if(a.cases > b.cases) {
            return -1;
        } else {
            return 1;
        }
    })
    return sortedData;
};

//to format the way we exibit the change in deaths, cases etc. so they will appear as "+363573" for example,
//we use stat:
//if that stat exist, take it and format it according to the following rule("0.0a")
export const prettyPrintStat = (stat) => 
    stat ? `+${numeral(stat).format("0.0a")}` : "+0";


//draw circles on the map with interactive tooltop
//this utility function will be taken into map.js:
export const showDataOnMap = (data, casesType='cases')=> (
    //every iteration is an object "country":
    data.map(country => (
<Circle 
center={[country.countryInfo.lat, country.countryInfo.long]}
fillOpacity={0.4}
color={casesTypeColors[casesType].hex}
fillColor={casesTypeColors[casesType].hex}
radius={
    Math.sqrt(country[casesType]) * casesTypeColors[casesType].multiplier
}
>
    {/* when we tap a circle, we want a popup to appear */}
<Popup>
    <div className="info__container">
        <div className="info__flag" style={{backgroundImage: `url(${country.countryInfo.flag})`}}/>
        <div className="info__name">{country.country}</div>
        <div className="info__cases">Cases: {numeral(country.cases).format("0,0")}</div>
        <div className="info__recovered">Recovered: {numeral(country.recovered).format("0,0")}</div>
        <div className="info__deaths">Deaths: {numeral(country.deaths).format("0,0")}</div>
    </div>
</Popup>
</Circle>
    ))
)