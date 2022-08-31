import { useEffect, useState } from 'react'
import PersonForm from './components/PersonForm'
import Persons from './components/Persons'
import Filter from './components/Filter'
import personService from './services/persons'
import Notification from './components/Notification'

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

  const onSubmit = (e) => {
    e.preventDefault()

    const newPerson = { name: newName, number: newNumber }
    personService
      .create(newPerson)
      .then(returnedPerson => {
        setPersons([
          ...persons,
          returnedPerson
        ])
        // const personExists = persons.find(p => p.id === returnedPerson.id)

        // if (!personExists) {
        //   setPersons([
        //     ...persons,
        //     returnedPerson
        //   ])
        //   return
        // }

        // setPersons(persons.map(person => {
        //   if (person.id === returnedPerson.id) return returnedPerson
          
        //   return person
        // }))

        setNotificationMessage({
          status: 'success',
          message: `${newPerson.name} was added successfully`,
          // message: `${newPerson.name} was ${existingUser ? 'updated' : 'added'} successfully`,
        })
      })
      .catch(async (err) => {
        if (err.response.status === 422) {
          const confirm = window.confirm(`${newName} is already added to phonebook, replace the old number with a new one?`)
      
          if (!confirm) return

          const foundedPerson = await personService.getPerson(newPerson.name)
          personService
            .update(foundedPerson.id, newPerson)
            .then(updatedPerson => {
              console.log(updatedPerson)
              setPersons(persons.map(person => {
                if (person.id === updatedPerson.id) return updatedPerson
                
                return person
              }))
            })
            .catch(err => {
              setNotificationMessage({
                status: 'error',
                message: err.response.data.error
              })
            })
        } else {
          setNotificationMessage({
            status: 'error',
            message: err.response.data.error
          })
        }
      })

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