import { useEffect, useState } from 'react'
import PersonForm from './components/PersonForm'
import Persons from './components/Persons'
import Filter from './components/Filter'
import personService from './services/persons'
import  Notification from './components/Notification'

const App = () => {
  const [persons, setPersons] = useState() 
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [search, setSearch] = useState('')
  const [notificationMessage, setNotificationMessage] = useState(null)

  useEffect(() => {
    personService
      .getAll()
      .then(persons => setPersons(persons))
  }, [])

  const handleNameChange = (e) => {
    setNewName(e.target.value)
  }
  
  const handleNumberChange = (e) => {
    setNewNumber(e.target.value)
  }
  
  const handleSearchChange = (e) => {
    setSearch(e.target.value)
  }

  const update = (person) => {
    personService
      .update(person)
      .then(updatedPerson => setPersons(persons.map(p => p.name === updatedPerson.name ? updatedPerson : p)))
      .catch(error => {
        setNotificationMessage({
          status: 'error',
          message: `Information of ${person.name} has already been removed from server`
        })
        setTimeout(() => {
          setNotificationMessage(null)
        }, 5000);
      })
  }

  const onSubmit = (e) => {
    e.preventDefault()
    const existingUser = persons.find(p => p.name === newName)
    if (existingUser) {
      const confirm = window.confirm(`${existingUser.name} is already added to phonebook, replace the old number with a new one?`)

      if (confirm) {
        update({ ...existingUser, number: newNumber })
        setNotificationMessage({
          status: 'success',
          message: `${existingUser.name}'s phone number updated successfully`
        })
      } else {
        return
      }
    } else {
      const newPerson = { name: newName, number: newNumber }
      personService
        .create(newPerson)
        .then(returnedPerson => {
          setPersons([
            ...persons,
            returnedPerson
          ])
        })
        setNotificationMessage({
          status: 'success',
          message: `${newPerson.name} was added successfully`
        })
    }
    setNewName('')
    setNewNumber('')
    setTimeout(() => {
      setNotificationMessage(null)
    }, 5000);
  }

  const remove = id => {
    const selectedPerson = persons.find(p => p.id === id)
    const confirm = window.confirm(`Delete ${selectedPerson.name}?`)

    if (confirm) {
      personService
        .remove(id)
        .then(() => setPersons(persons.filter(p => p.id !== id)))
    }
  }

  return (
    <div>
      <h2>Phonebook</h2>

      <Notification info={notificationMessage} />

      <Filter search={search} handleSearchChange={handleSearchChange} />

      <h2>add a new</h2>
      <PersonForm
        onSubmit={onSubmit}
        newName={newName}
        handleNameChange={handleNameChange}
        newNumber={newNumber}
        handleNumberChange={handleNumberChange}
      />

      <h2>Numbers</h2>
      <Persons persons={persons} search={search} remove={remove} />
    </div>
  )
}

export default App