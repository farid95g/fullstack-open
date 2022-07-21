import Person from './Person'

const Persons = ({ persons, search }) => (
    <div>
        {
            persons
                .filter(p => p.name.toLowerCase().includes(search.toLowerCase()))
                .map(person => <Person person={person} key={person.id} />)
        }
    </div>
)

export default Persons