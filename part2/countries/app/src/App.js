import { useState, useEffect } from 'react'
import axios from 'axios'
import Filter from './components/Filter'
import CountryList from './components/CountryList'
import SingleCountry from './components/SingleCountry'

function App() {
  const [countries, setCountries] = useState([])
  const [search, setSearch] = useState('')
  const [filteredContries, setFilteredCountries] = useState([])
  const [weatherReport, setWeatherReport] = useState({})

  useEffect(() => {
    axios
      .get('https://restcountries.com/v3.1/all')
      .then(response => setCountries(response.data))
  }, [])
  
  useEffect(() => {
    const filterResult = countries
      .filter(country => country.name.common
      .toLowerCase()
      .includes(search.toLowerCase()))

    if (filterResult.length > 1) {
      setFilteredCountries(filterResult)
    } else if (filterResult.length === 1) {
      const [lat, lon] = filterResult[0].capitalInfo.latlng
      axios
        .get(`https://api.openweathermap.org/data/2.5/weather?units=metric&lat=${lat}&lon=${lon}&appid=${process.env.REACT_APP_API_KEY}`)
        .then(response => {
          setFilteredCountries([...filterResult])
          setWeatherReport({
            city: filterResult[0].capital[0],
            temperature: response.data.main.temp,
            icon: response.data.weather[0].icon,
            windSpeed: response.data.wind.speed
          })
        })
    }
  }, [search])

  const handleCountrySearch = e => {
    setSearch(e.target.value)
  }

  const showSelectedCountry = name => {
    setSearch(name)
  }

  return (
    <div>
      <Filter
        search={search}
        handleCountrySearch={handleCountrySearch}
      />

      {
        filteredContries?.length > 0 && filteredContries?.length === 1
          ? <SingleCountry
            country={filteredContries[0]}
            weatherReport={weatherReport}
          />
          : filteredContries?.length <= 10
            ? <CountryList countries={filteredContries} showSelectedCountry={showSelectedCountry} />
            : <p>Too many matches, specify another filter</p>
      }
    </div>
  )
}

export default App
