import axios from 'axios'

const baseURL = '/api/persons'

const getAll = () => axios
    .get(baseURL)
    .then(response => response.data)

const create = (payload) => axios
    .post(baseURL, payload)
    .then(response => response.data)

const getPerson = (name) => axios
    .get(`${baseURL}/${name}`)
    .then(response => response.data)

const update = (id, payload) => axios
    .put(`${baseURL}/${id}`, payload)
    .then(response => response.data)

const remove = (id) => axios
    .delete(`${baseURL}/${id}`)
    .then(response => response.data)

export default { getAll, create, getPerson, update, remove }