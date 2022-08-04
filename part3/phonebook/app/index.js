const express = require('express')

let persons = [
    { 
      "id": 1,
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": 2,
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": 3,
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": 4,
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

const app = express()

app.use(express.json())

app.get('/api/persons', (req, res) => {
    res.json(persons)
})

app.post('/api/persons', (req, res) => {
    const { name, number } = req.body
    const nameExists = persons.find(person => person.name === name)

    if (!name || !number || nameExists) {
        return res.status(400)
            .json({
                error: nameExists 
                    ? 'name must be unique'
                    : !name
                        ? 'you must enter name'
                        : 'you must enter phone number'
            })
    }

    const newPerson = {
        id: Math.random(),
        name,
        number
    }

    persons = persons.concat(newPerson)
    res.status(201).json(newPerson)
})

app.get('/api/persons/:id', (req, res) => {
    const selectedId = Number(req.params.id)
    const person = persons.find(p => p.id === selectedId)
    if (person) {
        return res.json(person)
    }
    res.status(404).end()
})

app.delete('/api/persons/:id', (req, res) => {
    const selectedId = Number(req.params.id)
    persons = persons.filter(p => p.id !== selectedId)

    res.status(204).end()
})

app.get('/info', (req, res) => {
    res.send(`<div>
        <p>Phonebook has info for ${persons.length} people</p>
        <p>${new Date()}</p>
    </div>`)
})

const PORT = 3001
app.listen(PORT, () => console.log(`Server has started on PORT ${PORT}`))