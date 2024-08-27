import { useDispatch } from 'react-redux'
import { createAnecdote } from '../reducers/anecdoteReducer'
import { setNotification } from '../reducers/notificationReducer'

const AnecdoteForm = () => {
	const dispatch = useDispatch()

	const createNewAnecdote = async (event) => {
		event.preventDefault()
		const anecdoteContent = event.target.anecdote.value
		event.target.anecdote.value = ''
		dispatch(createAnecdote(anecdoteContent))
		dispatch(setNotification(`You have created an anectode: ${anecdoteContent}`, 10))
	}

	return (
		<>
			<h2>create new</h2>
			<form onSubmit={createNewAnecdote}>
				<div>
				<input name='anecdote' />
				</div>
				<button type='submit'>create</button>
			</form>
		</>
	)
}

export default AnecdoteForm
