import axios from 'axios'

const getAll = () => axios
    .get('http://localhost:3001/persons')
    .then(response => response.data)

const create = (person) => axios
    .post('http://localhost:3001/persons', person)
    .then(response => response.data)

const update = (person) => axios
    .put(`http://localhost:3001/persons/${person.id}`, person)
    .then(response => response.data)

const remove = (id) => axios
    .delete(`http://localhost:3001/persons/${id}`)
    .then(response => response.data)

export default { getAll, create, update, remove }