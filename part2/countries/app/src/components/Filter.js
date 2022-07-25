const Filter = ({ search, handleCountrySearch }) => {
    return (
        <div>
            <label>find countries</label>
            <input
                value={search}
                onChange={handleCountrySearch}
            />
        </div>
    )
}

export default Filter