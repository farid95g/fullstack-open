import WeatherReport from './WeatherReport'

const SingleCountry = ({ country, weatherReport }) => {
    return (
        <div>
            <h1>{country.name.common}</h1>
            <p>capital {country.capital[0]}</p>
            <p>area {country.area}</p>
            <h4>languages:</h4>
            <ul>
                {Object.keys(country.languages).map(language => (
                    <li key={language}>{country.languages[language]}</li>
                ))}
            </ul>
            <img src={country.flags.png} />
            <WeatherReport
                city={weatherReport.city}
                temperature={weatherReport.temperature}
                icon={weatherReport.icon}
                windSpeed={weatherReport.windSpeed}
            />
        </div>
    )
}

export default SingleCountry