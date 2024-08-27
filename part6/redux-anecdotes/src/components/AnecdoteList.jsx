import { useSelector, useDispatch } from 'react-redux'
import { voteAnecdoteThunk } from '../reducers/anecdoteReducer'
import { setNotification } from '../reducers/notificationReducer'

const Anecdote = ({ anecdote, handleClick }) => {
	return (
		<div key={anecdote.id}>
			<div>
				{anecdote.content}
			</div>
			<div>
				has {anecdote.votes}
				<button onClick={handleClick}>vote</button>
			</div>
		</div>
	)
}

const AnecdoteList = () => {
	const anecdotes = useSelector(state => {
		const { anecdotes, filter } = state
		
		if (!filter) return anecdotes
		
		return anecdotes.filter(a => a.content.includes(filter))
	})
	
	const dispatch = useDispatch()

	const vote = (id) => {
		dispatch(voteAnecdoteThunk(id))
		const votedAnecdote = anecdotes.find(a => a.id === id)
		dispatch(setNotification(`You voted '${votedAnecdote.content}'`, 5))
	}

	return [...anecdotes].sort((a1, a2) => a2.votes - a1.votes).map(anecdote =>
		<Anecdote
			key={anecdote.id}
			anecdote={anecdote}
			handleClick={() => vote(anecdote.id)}
		/>
	)
}

export default AnecdoteList
