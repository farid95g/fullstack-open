import { useState } from 'react'
import Persons from './components/Persons'
import PersonForm from './components/PersonForm'
import Filter from './components/Filter'

const App = () => {
    const [persons, setPersons] = useState([
        { name: 'Arto Hellas', number: '040-123456', id: 1 },
        { name: 'Ada Lovelace', number: '39-44-5323523', id: 2 },
        { name: 'Dan Abramov', number: '12-43-234345', id: 3 },
        { name: 'Mary Poppendieck', number: '39-23-6423122', id: 4 }
    ])
    const [newName, setNewName] = useState('')
    const [newNumber, setNewNumber] = useState('')
    const [filter, setFilter] = useState('')

    const addNewPerson = (event) => {
        event.preventDefault()
        const foundName = persons.find(
            (person) => person.name.toLowerCase() === newName.toLowerCase()
        )

        if (foundName) {
            alert(`${newName} is already added to phonebook`)
            return
        }

        setPersons(
            persons.concat({
                name: newName,
                number: newNumber,
                id: persons.length + 1
            })
        )
        setNewName('')
        setNewNumber('')
    }

    const filteredPersons = persons.filter((person) =>
        person.name.toLowerCase().includes(filter.toLowerCase())
    )

    return (
        <div>
            <h2>Phonebook</h2>

            <Filter
                filter={filter}
                setFilter={setFilter}
            />

            <h2>add a new</h2>

            <PersonForm
                addNewPerson={addNewPerson}
                newName={newName}
                setNewName={setNewName}
                newNumber={newNumber}
                setNewNumber={setNewNumber}
            />

            <h3>Numbers</h3>

            <Persons persons={filteredPersons} />
        </div>
    )
}

export default App
