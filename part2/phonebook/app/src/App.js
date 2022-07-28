import { useEffect, useState } from 'react'
import axios from 'axios'
import PersonForm from './components/PersonForm'
import Persons from './components/Persons'
import Filter from './components/Filter'
import personService from './services/persons'

const App = () => {
  const [persons, setPersons] = useState() 
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [search, setSearch] = useState('')

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
  }

  const onSubmit = (e) => {
    e.preventDefault()
    const existingUser = persons.find(p => p.name === newName)
    if (existingUser) {
      const confirm = window.confirm(`${existingUser.name} is already added to phonebook, replace the old number with a new one?`)

      if (confirm) {
        update({ ...existingUser, number: newNumber })
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
    }
    setNewName('')
    setNewNumber('')
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