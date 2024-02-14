import { useEffect, useState } from 'react'
import Persons from './components/Persons'
import PersonForm from './components/PersonForm'
import Filter from './components/Filter'
import personService from './services/person'
import Notification from './components/Notification'

const App = () => {
    const [persons, setPersons] = useState([])
    const [newName, setNewName] = useState('')
    const [newNumber, setNewNumber] = useState('')
    const [filter, setFilter] = useState('')
    const [notification, setNotification] = useState(null)

    useEffect(() => {
        personService.getAll().then((initialPersons) => {
            setPersons(initialPersons)
        })
    }, [])

    const addNewPerson = (event) => {
        event.preventDefault()

        const newPerson = {
            name: newName,
            number: newNumber
        }

        personService.create(newPerson).then((newPerson) => {
            setPersons(persons.concat(newPerson))
            setNotification({
                message: `Added ${newPerson.name}`,
                status: 'success'
            })
            setTimeout(() => {
                setNotification(null)
            }, 5000)
        }).catch(error => {
            if (error.response.status === 422) {
                return personService
                    .update(error.response.data.id, newPerson)
                    .then(updatedPerson => {
                        setPersons(persons.map(p => {
                            if (p.id === updatedPerson.id) return updatedPerson
                            return p
                        }))
                    })
                    .catch(() => {
                        setNotification({
                            message: `Failed to update user ${newPerson.name}`,
                            status: 'error'
                        })
                    })
            }
            
            console.log(error)
        })

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

            <Notification
                message={notification?.message}
                status={notification?.status}
            />

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
