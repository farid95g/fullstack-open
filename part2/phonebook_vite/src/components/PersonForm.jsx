const PersonForm = ({
    addNewPerson,
    newName,
    setNewName,
    newNumber,
    setNewNumber
}) => {
    return (
        <form onSubmit={addNewPerson}>
            <div>
                name:{' '}
                <input
                    value={newName}
                    onChange={(ev) => setNewName(ev.target.value)}
                />
            </div>
            <div>
                number:{' '}
                <input
                    value={newNumber}
                    onChange={(ev) => setNewNumber(ev.target.value)}
                />
            </div>
            <div>
                <button type='submit'>add</button>
            </div>
        </form>
    )
}

export default PersonForm
