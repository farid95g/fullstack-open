import { useEffect, useState } from 'react'
import Persons from './components/Persons'
import PersonForm from './components/PersonForm'
import Filter from './components/Filter'
import personService from './services/person'

const App = () => {
    const [persons, setPersons] = useState([])
    const [newName, setNewName] = useState('')
    const [newNumber, setNewNumber] = useState('')
    const [filter, setFilter] = useState('')

    useEffect(() => {
        personService.getAll().then((initialPersons) => {
            setPersons(initialPersons)
        })
    }, [])

    const addNewPerson = (event) => {
        event.preventDefault()
        const foundPerson = persons.find(
            (person) => person.name.toLowerCase() === newName.toLowerCase()
        )

        if (foundPerson) {
            const updatePerson = confirm(
                `${foundPerson.name} is already added to phonebook, replace the old number with a new one?`
            )

            if (!updatePerson) return

            personService
                .update(foundPerson.id, {
                    ...foundPerson,
                    number: newNumber
                })
                .then((updatedUser) => {
                    setPersons(
                        persons.map((person) =>
                            person.id !== updatedUser.id ? person : updatedUser
                        )
                    )
                })
        } else {
            const newPerson = {
                name: newName,
                number: newNumber
            }

            personService.create(newPerson).then((newPerson) => {
                setPersons(persons.concat(newPerson))
            })
        }

        setNewName('')
        setNewNumber('')
    }

    const filteredPersons = persons.filter((person) =>
        person.name.toLowerCase().includes(filter.toLowerCase())
    )

    const deletePerson = (person) => {
        const shouldDelete = confirm(`Delete ${person.name}?`)

        if (!shouldDelete) return

        personService.remove(person.id).then(() => {
            setPersons(persons.filter((p) => p.id !== person.id))
        })
    }

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

            <Persons
                persons={filteredPersons}
                deletePerson={deletePerson}
            />
        </div>
    )
}

export default App
