const CountriesList = ({ countries, showSelectedCountry }) => {
    return (
        <ul>
            {countries.map((country) => (
                <li key={country.name.common}>
                    {country.name.common}
                    <button onClick={() => showSelectedCountry(country)}>show</button>
                </li>
            ))}
        </ul>
    )
}

export default CountriesList
