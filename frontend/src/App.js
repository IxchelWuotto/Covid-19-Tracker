import React, { useEffect, useState } from "react";
import { MenuItem, FormControl, Select, Card, CardContent } from "@material-ui/core";
import InfoBox from "./InfoBox";
import Map from "./Map";
import "./App.css";
import Table from "./Table";
import { sortData } from "./util";
import LineGraph from "./LineGraph";

function App() {

  const [countries, setCountries] = useState([]);
  const [country, setCountry] = useState("worldwide");
  const [countryInfo, setCountryInfo] = useState({});
  const [tableData, setTableData] = useState([])

  useEffect(() => {
    fetch("https://corona.lmao.ninja/v2/all?yesterday") //here goes the csv instead of api
      .then(response => response.json())
      .then(data => {
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
        });
    };

    getCountriesData();
  }, []);

  const onCountryChange = async (event) => {
    const countryCode = event.target.value;
    //the dropdown stays in the name you click on
    setCountry(countryCode);

    const url =
      countryCode == "wordlwide"
        ? "https://corona.lmao.ninja/v2/countries?yesterday=&sort="
        : `https://corona.lmao.ninja/v2/countries/:query?yesterday&strict&query/${countryCode}`;

    await fetch(url)
      .then(response => response.json())
      .then(data => {
        //All of the data from the country respone
        setCountryInfo(data);
      })
  };

  console.log('COUNTRY INFO >>>', countryInfo)

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
                countries.map(country => (
                  <MenuItem value={country.value}>{country.name}</MenuItem>
                ))}

            </Select>
          </FormControl>
        </div>

        <div className="app__stats">
          <InfoBox title="Coronavirus Cases" cases={countryInfo.todayCases} total={countryInfo.cases} />

          <InfoBox title="Recovered" cases={countryInfo.todayRecovered} total={countryInfo.recovered} />

          <InfoBox title="Deaths" cases={countryInfo.todayDeaths} total={countryInfo.deaths} />
        </div>

        <Map />
      </div>
      <Card className="app__right">
        <CardContent>
          <h3>Live Cases by Country</h3>
          <Table countries={tableData} />
          <h3>Worldwide new cases</h3>
          <LineGraph />
        </CardContent>
      </Card>
    </div>
  );
}

export default App;
