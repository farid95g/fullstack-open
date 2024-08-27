import axios from 'axios'

const baseUrl = 'http://localhost:3001/anecdotes'

const getAll = async () => {
	const response = await axios.get(baseUrl)
	return response.data
}

const create = async (content) => {
	const requestBody = { content, votes: 0 }
	const response = await axios.post(baseUrl, requestBody)
	return response.data
}

const update = async (id) => {
	const { data: currentAnecdote } = await axios.get(`${baseUrl}/${id}`)
	const response = await axios.put(`${baseUrl}/${id}`, {
		...currentAnecdote, votes: currentAnecdote.votes + 1
	})
	return response.data
}

export default { getAll, create, update }