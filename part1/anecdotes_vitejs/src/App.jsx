import { useState } from 'react'

function App() {
    const anecdotes = [
        'If it hurts, do it more often.',
        'Adding manpower to a late software project makes it later!',
        'The first 90 percent of the code accounts for the first 10 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
        'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
        'Premature optimization is the root of all evil.',
        'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.',
        'Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when diagnosing patients.',
        'The only way to go fast, is to go well.'
    ]

    const [selected, setSelected] = useState(0)
    const [votes, setVotes] = useState(Array(anecdotes.length).fill(0))
    const [mostVotesAnectodeIndex, setMostVotedAnectodeIndex] = useState(0)

    const getMostVoted = (updatedVotes) => {
        const [mostVote] = [...updatedVotes].sort((a, b) => b - a)
        const mostVotedIndex = updatedVotes.findIndex((vote) => vote === mostVote)
        setMostVotedAnectodeIndex(mostVotedIndex)
    }

    const getNextAnecdote = () => {
        const randomIndex = Math.floor(Math.random() * anecdotes.length)
        setSelected(randomIndex)
        getMostVoted(votes)
    }

    const voteAnecdote = () => {
        setVotes(votes.map((vote, i) => (i === selected ? vote + 1 : vote)))
        getMostVoted(votes.map((vote, i) => (i === selected ? vote + 1 : vote)))
    }

    return (
        <>
            <h1>Anectode of the day</h1>
            <div>{anecdotes[selected]}</div>
            <div>has {votes[selected]} votes</div>
            <button onClick={voteAnecdote}>vote</button>
            <button onClick={getNextAnecdote}>next anecdote</button>
            <h1>Anectode with most votes</h1>
            <p>{anecdotes[mostVotesAnectodeIndex]}</p>
            <p>has {votes[mostVotesAnectodeIndex]} votes</p>
        </>
    )
}

export default App
