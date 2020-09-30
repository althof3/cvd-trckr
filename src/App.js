import React, { useState, useEffect } from 'react';
import './App.css';
import {
  MenuItem,
  FormControl,
  Select,
  Card,
  CardContent,
} from '@material-ui/core'
import InfoBox from './InfoBox/InfoBox';
import Map from './Map/Map';
import Table from './Table/Table';
import { sortData, prettyprintStat } from './util';
import LineGraph from './LineGraph/LineGraph';
import "leaflet/dist/leaflet.css";

function App () {

  const [countries, setCountries] = useState([])
  const [country, setCountry] = useState('worldwide')
  const [countryInfo, setCountryInfo] = useState({})
  const [tableData, setTableData] = useState([])
  const [mapCenter, setMapCenter] = useState({lat: 34.80746, lng: -40.4796})
  const [mapZoom, setMapZoom] = useState(3)
  const [mapCountries, setMapCountries] = useState([])
  const [casesType, setCasesType] = useState("cases")


  // https://disease.sh/v3/covid-19/countries

  useEffect( () => {
    fetch('https://disease.sh/v3/covid-19/all')
    .then(response => response.json())
    .then(data => {
      setCountryInfo(data)
      // setMapCountries(data)
    })

    const getCountriesData = async () => {
      fetch("https://disease.sh/v3/covid-19/countries")
        .then((response) => response.json())
        .then((data) => {
          const countries = data.map((country) => ({
            name: country.country,
            value: country.countryInfo.iso2,
          }));
          let sortedData = sortData(data);
          setCountries(countries);
          setMapCountries(data);
          setTableData(sortedData);
        });
    };

    getCountriesData();
  }, [])

  const onCountryChange = async(e) => {
    const countryCode = e.target.value
    setCountry(countryCode) 

    const url = 
      (countryCode === "worldwide" 
        ? "https://disease.sh/v3/covid-19/all" 
        : `https://disease.sh/v3/covid-19/countries/${countryCode}`)

    await fetch(url)
    .then(response => response.json())
    .then(data => {
      setCountryInfo(data);
      setMapCenter([data.countryInfo.lat, data.countryInfo.long]);
      setMapZoom(4);
    })
  }
  
  return (
    
    <div className="app">
      <div className='app__left'>
        <div className='app__header'>
          <h1>COVID-19 TRACKER</h1>
          <FormControl className='app__dropdown' >
            <Select variant="outlined" value={country} onChange={onCountryChange} >
              <MenuItem value="worldwide">Worldwide</MenuItem>
              {
                countries.map(country => (
                  <MenuItem value={country.value}>{country.name}</MenuItem>
                ))
              }
            </Select>
          </FormControl>
        </div>

        <div className="app__stats">
          <InfoBox title="Coronavirus Cases" 
            cases={prettyprintStat(countryInfo.todayCases)}
            total={countryInfo.cases}
            onClick = {e => setCasesType('cases')}
          />
          <InfoBox title="Recovered" 
            cases={prettyprintStat(countryInfo.todayRecovered)}
            total={countryInfo.recovered}
            onClick = {e => setCasesType('recovered')}
          />
          <InfoBox title="Deaths" 
            cases={prettyprintStat(countryInfo.todayDeaths)}
            total={countryInfo.deaths}
            onClick = {e => setCasesType('deaths')}
          />
        </div>

        <Map 
          casesType={casesType}
          center={mapCenter}
          zoom={mapZoom}
          countries={mapCountries}
        />
      </div>

      <Card className='app__right'>
        <CardContent>
          <h3>Live Cases by Country</h3>
          <Table countries={tableData}/>

          <h3>Worldwide new {casesType}</h3>
          <LineGraph casesType={casesType} />
        </CardContent>
      </Card>
    </div>
  );
  
}

export default App;
