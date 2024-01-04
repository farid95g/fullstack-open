const SingleCountry = ({ country, weather }) => {
    return (
        <div>
            <h1>{country.name.common}</h1>
            <p>capital {country.capital[0]}</p>
            <p>area {country.area}</p>
            <h3>languages</h3>
            <ul>
                {Object.values(country.languages).map((value) => (
                    <li key={value}>{value}</li>
                ))}
            </ul>
            <img src={country.flags.png} alt={country.name.common + ' flag'} />
            <h2>Weather in {country.capital[0]}</h2>
            <p>temperature {weather?.main?.temp} Celsius</p>
            <img
                src={`https://openweathermap.org/img/wn/${weather?.weather[0]?.icon}@2x.png`}
                alt={`http://${weather?.weather[0]?.description}`}
            />
            <p>wind {weather?.wind?.speed} m/s</p>
        </div>
    )
}

export default SingleCountry
