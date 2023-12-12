import { useEffect, useState } from 'react'
import axios from 'axios'
import Persons from './components/Persons'
import PersonForm from './components/PersonForm'
import Filter from './components/Filter'

const App = () => {
    const [persons, setPersons] = useState([])
    const [newName, setNewName] = useState('')
    const [newNumber, setNewNumber] = useState('')
    const [filter, setFilter] = useState('')

    useEffect(() => {
        axios.get('http://localhost:3001/persons').then((response) => {
            setPersons(response.data)
        })
    }, [])

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
