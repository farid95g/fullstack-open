const Filter = ({ filter, setFilter }) => {
    return (
        <div>
            filter shown with
            <input
                value={filter}
                onChange={(ev) => setFilter(ev.target.value)}
            />
        </div>
    )
}

export default Filter
