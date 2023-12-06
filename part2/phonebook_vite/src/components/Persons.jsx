const PersonDetail = ({ person }) => (
    <div>
        {person.name} {person.number}
    </div>
)

const Persons = ({ persons }) => {
    return (
        <div>
            {persons.map((person) => (
                <PersonDetail
                    key={person.id}
                    person={person}
                />
            ))}
        </div>
    )
}

export default Persons
