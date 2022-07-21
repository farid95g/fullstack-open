const Filter = ({ search, handleSearchChange }) => (
    <div>
        <label>filter shown with</label>
        <input value={search} onChange={handleSearchChange} />
    </div>
)

export default Filter