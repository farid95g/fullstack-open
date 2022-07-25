const WeatherReport = ({ city, temperature, icon, windSpeed }) => {
    return (
        <div>
            <h2>Weather in {city}</h2>
            <p>temperature {temperature} Celcius</p>
            <img src={`http://openweathermap.org/img/w/${icon}.png`} />
            <p>wind {windSpeed} m/s</p>
        </div>
    )
}

export default WeatherReport