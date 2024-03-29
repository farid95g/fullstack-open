import { useEffect, useState } from 'react'
import axios from 'axios'
import CountriesList from './components/CountriesList'
import SingleCountry from './components/SingleCountry'
import Search from './components/Search'
import Message from './components/Message'

function App() {
    const [search, setSearch] = useState('')
    const [countries, setCountries] = useState([])
    const [message, setMessage] = useState('')
    const [searchResult, setSearchResult] = useState([])
    const [weather, setWeather] = useState(null)

    useEffect(() => {
        axios
            .get('https://studies.cs.helsinki.fi/restcountries/api/all')
            .then((response) => setCountries(response.data))
    }, [])

    useEffect(() => {
        if (search) {
            const filteredCountries = countries?.filter((country) =>
                country.name.common.toLowerCase().includes(search.toLowerCase())
            )

            if (filteredCountries.length > 10) {
                setMessage('Too many matches, specify another filter!')
                setSearchResult([])
            } else if (!filteredCountries.length) {
                setMessage('No matches found!')
                setSearchResult([])
            } else {
                setSearchResult(filteredCountries)
                setMessage('')
            }
        } else {
            setSearchResult([])
            setMessage('')
        }
    }, [search])

    useEffect(() => {
        if (searchResult.length === 1) {
            const [lat, lon] = searchResult[0].capitalInfo.latlng

            axios
                .get(`https://api.openweathermap.org/data/2.5/weather?units=metric&lat=${lat}&lon=${lon}&appid=${import.meta.env.VITE_WEATHER_API_KEY}`)
                .then(response => setWeather(response?.data))
                .catch(error => console.log(error))
        } else {
            setWeather(null)
        }
    }, [searchResult])

    const showSelectedCountry = (selectedCountry) => {
        setSearchResult([selectedCountry])
    }

    return (
        <div>
            <Search
                search={search}
                setSearch={setSearch}
            />
            {message && <Message message={message} />}
            {searchResult && searchResult.length > 1 && (
                <CountriesList
                    countries={searchResult}
                    showSelectedCountry={showSelectedCountry}
                />
            )}
            {searchResult && searchResult.length === 1 && (
                <SingleCountry country={searchResult[0]} weather={weather} />
            )}
        </div>
    )
}

export default App
