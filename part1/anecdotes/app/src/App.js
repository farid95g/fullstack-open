import { useEffect, useState } from 'react'

const App = () => {
  const anecdotes = [
    'If it hurts, do it more often.',
    'Adding manpower to a late software project makes it later!',
    'The first 90 percent of the code accounts for the first 10 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
    'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
    'Premature optimization is the root of all evil.',
    'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.',
    'Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when diagnosing patients.'
  ]

  const [selected, setSelected] = useState(0)
  const [points, setPoints] = useState(Array(anecdotes.length).fill(0))
  const [highestVote, setHighestVote] = useState(0)
  const [mostVotedAnecdote, setMostVotedAnecdote] = useState(anecdotes[0])

  const getRandomAnecdote = () => setSelected(Math.floor(Math.random() * anecdotes.length))

  const voteForAnecdote = () => {
    setPoints(points.map((p, i) => i === selected ? p + 1 : p))
  }

  useEffect(() => {
    setHighestVote([...points].sort((p1, p2) => p2 - p1)[0])
  }, [points])
  
  useEffect(() => {
    setMostVotedAnecdote(anecdotes[points.indexOf(highestVote)])
  }, [highestVote])

  return (
    <>
      <div>
        <div>
          <h1>Anectode of the day</h1>
          <p>{anecdotes[selected]}</p>
          <p>has {points[selected] || 0} votes</p>
        </div>
        <button onClick={voteForAnecdote}>vote</button>
        <button onClick={getRandomAnecdote}>next anecdote</button>
      </div>
      <div>
        <h1>Anectode with most votes</h1>
        <p>{mostVotedAnecdote}</p>
        <p>has {highestVote} votes</p>
      </div>
    </>
  )
}

export default App