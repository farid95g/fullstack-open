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
                    setNotification({
                        message: `Update number of user ${updatedUser.name}`,
                        status: 'success'
                    })
                    setTimeout(() => {
                        setNotification(null)
                    }, 5000)
                }).catch(() => {
                    setNotification({
                        message: `Information of ${foundPerson.name} has already been removed from server`,
                        status: 'error'
                    })
                    setTimeout(() => {
                        setNotification(null)
                    }, 5000)
                })
        } else {
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
