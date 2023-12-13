const PersonDetail = ({ person, deletePerson }) => (
    <div>
        {person.name} {person.number}
        <button onClick={deletePerson}>delete</button>
    </div>
)

const Persons = ({ persons, deletePerson }) => {
    return (
        <div>
            {persons.map((person) => (
                <PersonDetail
                    key={person.id}
                    person={person}
                    deletePerson={() => deletePerson(person)}
                />
            ))}
        </div>
    )
}

export default Persons
