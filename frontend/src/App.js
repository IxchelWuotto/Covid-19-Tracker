import React, { useEffect, useState } from "react";
import { MenuItem, FormControl, Select, Card, CardContent, } from "@material-ui/core";
import InfoBox from "./InfoBox";
import Map from "./Map";
import "./App.css";
import Table from "./Table";
import LineGraph from "./LineGraph";
import { sortData, prettyPrintStat } from "./util";
import "leaflet/dist/leaflet.css";

function App() {

  const [countries, setCountries] = useState([]);
  const [country, setInputCountry] = useState("worldwide");
  const [countryInfo, setCountryInfo] = useState({});
  const [tableData, setTableData] = useState([]);
  const [casesType, setCasesType] = useState("cases");
  const [mapCenter, setMapCenter] = useState({ lat: 34.80746, lng: -40.4796 });
  const [mapZoom, setMapZoom] = useState(3);
  const [mapCountries, setMapCountries] = useState([]);
  const [isLoading, setLoading] = useState(false);

  useEffect(() => {
    fetch("https://corona.lmao.ninja/v2/all?yesterday") //here goes the csv instead of api
      .then((response) => response.json())
      .then((data) => {
        setCountryInfo(data);
      });
    /*fetch("http://localhost:5000/getdata")
       .then(response => response.json())
       .then(data => {
         setCountryInfo(data);
       });*/
  }, [])


  useEffect(() => {
    const getCountriesData = async () => {
      await fetch("https://corona.lmao.ninja/v2/countries?yesterday=&sort=")
        .then((response) => response.json())
        .then((data) => {
          const countries = data.map((country) => ({
            name: country.country, // United States, United Kingdon, France
            value: country.countryInfo.iso2 //UK,USA,FR
          }));
          const sortedData = sortData(data);
          setTableData(sortedData);
          setCountries(countries);
          setMapCountries(data);
        });
    };

    getCountriesData();
  }, []);


  const onCountryChange = async (event) => {
    setLoading(true);
    const countryCode = event.target.value;
    //the dropdown stays in the name you click on

    setCountryInfo(countryCode);

    const url =
      countryCode === "wordlwide"
        ? "https://corona.lmao.ninja/v2/countries?yesterday=&sort="
        : `https://corona.lmao.ninja/v2/countries/:query?yesterday&strict&query/${countryCode}`;

    await fetch(url)
      .then((response) => response.json())
      .then((data) => {
        //All of the data from the country respone
        setCountryInfo(data);
        setMapCenter([data.countryInfo.lat, data.countryInfo.long]);
        setMapZoom(4);
        setInputCountry(countryCode);
        setLoading(false);
        countryCode === "worldwide"
          ? setMapCenter([34.80746, -40.4796])
          : setMapCenter([data.countryInfo.lat, data.countryInfo.long]);
      });
    console.log(countryInfo);
  };

  return (
    <div className="app">
      <div className="app__left">
        <div className="app_header">
          <h1>COVID-19 Dashboard</h1>
          <FormControl className="app__dropdown">
            <Select variant="outlined" onChange={onCountryChange} value={country}>
              {/* Loopn through all the countries and drop down list of the options */}
              <MenuItem value="worldwide">Worldwide</MenuItem>
              {countries &&
                countries.map((country) => (
                  <MenuItem value={country.value}>{country.name}</MenuItem>
                ))}
            </Select>
          </FormControl>
        </div>
        <div className="app__stats">
          <InfoBox isRed active={casesType === "cases"} className="infoBox__cases" onClick={(e) => setCasesType("cases")} title="Coronavirus Cases"
            total={prettyPrintStat(countryInfo.cases)} cases={prettyPrintStat(countryInfo.todayCases)} isloading={isLoading} />

          <InfoBox active={casesType === "recovered"} className="infoBox__recovered" onClick={(e) => setCasesType("recovered")} title="Recovered"
            total={prettyPrintStat(countryInfo.recovered)} cases={prettyPrintStat(countryInfo.todayRecovered)} isloading={isLoading} />

          <InfoBox isGrey active={casesType === "deaths"} className="infoBox__deaths" onClick={(e) => setCasesType("deaths")} title="Deaths"
            total={prettyPrintStat(countryInfo.deaths)} cases={prettyPrintStat(countryInfo.todayDeaths)} isloading={isLoading} />
        </div>

        <Map
          countries={mapCountries}
          casesType={casesType}
          center={mapCenter}
          zoom={mapZoom}
        />
      </div>
      <Card className="app__right">
        <CardContent>
          <div className="app_information">
            <h3>Live Cases by Country</h3>
            <Table countries={tableData} />
            <h3 className="app__graphTitle">WorldWide new {casesType}</h3>
            <LineGraph casesType={casesType} />
          </div>
        </CardContent>
      </Card>
    </div >
  );
};

export default App;
