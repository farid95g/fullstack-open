const CountryList = ({ countries, showSelectedCountry }) => {
    return (
        <ul>
            {countries.map(country => (
                <li key={country.name.common}>
                    {country.name.common}
                    <button onClick={() => showSelectedCountry(country.name.common)}>show</button>
                </li>
            ))}
        </ul>
    )
}

export default CountryList