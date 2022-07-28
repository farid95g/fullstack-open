import Person from './Person'

const Persons = ({ persons, search, remove }) => (
    <div>
        {
            persons
                ?.filter(p => p.name.toLowerCase().includes(search.toLowerCase()))
                .map(person => <Person person={person} key={person.id} remove={remove} />)
        }
    </div>
)

export default Persons