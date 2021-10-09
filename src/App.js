import React, { useState, useEffect } from "react";
import "./App.css";
import {
  MenuItem,
  FormControl,
  Select,
  CardContent,
  Card,
} from "@material-ui/core";
import InfoBox from "./InfoBox";
import Map from "./Map";
import Table from "./Table";
import { prettyPrintStat, sortData } from "./util";
import LineGraph from "./LineGraph";
import { red } from "@material-ui/core/colors";
import "leaflet/dist/leaflet.css";



function App() {
  const [countries, setCountries] = useState(["Israel", "India", "UK"]);
  const [country, setCountry] = useState("worldwide");
  const [countryInfo, setCountryInfo] = useState({});
  const [tableData, setTableData] = useState([]);
  const [mapCenter, setMapCenter] = useState({ lat: 34.80746, lng: -40.4796 });
  const [mapZoom, setMapZoom] = useState(3);
  const [mapCountries, setMapCountries] = useState([]);
  const [casesType, setCasesType] = useState("cases");

  //without that fetch - the data of "worldwide" will not load
  //the first time (we will see blank for "worldwide"), onle the second time we manually
  //choose "worldwide"
  useEffect(() => {
    fetch("https://disease.sh/v3/covid-19/all")
      .then((response) => response.json())
      .then((data) => {
        setCountryInfo(data);
      });
  }, []);

  useEffect(() => {
    const getCountriesData = async () => {
      await fetch("https://disease.sh/v3/covid-19/countries")
        .then((response) => response.json()) //we accsess the json containing all data
        .then((data) => {
          //we acsess only specific data and map it: here we need only country names to map in the dropdown
          const countries = data.map((country) => ({
            name: country.country, //united state, united kingdom
            value: country.countryInfo.iso2, // USA, UK
          }));
          const sortedData = sortData(data);
          //this setTableData will be used if we want to see resalts according to the number of cases
          setTableData(sortedData);
          //this setTableData will be used for seeing results unsorted, alfabetically
          //setTableData(data);
          setMapCountries(data); //i need all information
          setCountries(countries);
        });
    };
    //after setting, we are getting:
    getCountriesData();
  }, []);

  const onCountryChange = async (event) => {
    const countryCode = event.target.value;

    //setCountry(countryCode);

    const url =
      countryCode === "worldwide"
        ? "https://disease.sh/v3/covid-19/all"
        : `https://disease.sh/v3/covid-19/countries/${countryCode}`;

    //what we are doing is waiting and fetching data from the url/
    //at first, we get the response as plain json with all data
    //and after that we get data for individual country, setting the data
    //according to the country that we return

    await fetch(url)
      .then((response) => response.json())
      .then((data) => {
        setCountry(countryCode); //update the input field
        setCountryInfo(data); //store the response of the country information into a variable (all the data)

        setMapCenter([data.countryInfo.lat, data.countryInfo.lng]);
        setMapZoom(4);
      });
  };

  console.log("countryInfo>>>>>", countryInfo);

  return (
    <div className="app">
      <div className="app__left">
        <div className="app__header">
          <h1>COVID-19 TRACKER</h1>
          <FormControl className="app__dropdown">
            <Select
              variant="outlined"
              onChange={onCountryChange}
              value={country}
            >
              <MenuItem value="worldwide">Worldwide</MenuItem>
              {countries.map((country) => (
                <MenuItem value={country.value}>{country.name}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>

        <div className="app__stats">
          <InfoBox
          isRed
          //how will i know which infoBox is activ? using active property:
          //after doing so, we need to pass it into the infoBox component
          active={casesType === "cases"}
          onClick={(e) => setCasesType('cases')}
            title="Coronavirus Cases"
            cases={prettyPrintStat(countryInfo.todayCases)}
            //we can do the exact same with the total num. but i chose not to change the appearence of the number....
            total={countryInfo.cases}
          />
          <InfoBox
          active={casesType === "recovered"}
          onClick={(e) => setCasesType('recovered')}
            title="Recoverd"
            cases={prettyPrintStat(countryInfo.todayRecovered)}
            total={countryInfo.recovered}
          />
          <InfoBox
          active={casesType === "deaths"}
          onClick={(e) => setCasesType('deaths')}
            title="Deaths"
            cases={prettyPrintStat(countryInfo.todayDeaths)}
            total={countryInfo.deaths}
          />
        </div>

        <Map 
        casesType={casesType}
        countries={mapCountries} 
        center={mapCenter} 
        zoom={mapZoom} />
      </div>
      <Card className="app__right">
        <CardContent>
          <h3>Live cases by country</h3>
          <Table countries={tableData} />
          <h3 style={{ color: "red" }}>Worldwide new {casesType}</h3>
          <LineGraph className="app__graph" casesType={casesType}/>
        </CardContent>
      </Card>
    </div>
  );
}

export default App;
