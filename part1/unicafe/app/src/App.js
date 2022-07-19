import { useState } from 'react'
import Button from './Button'
import Statistics from './Statistics'

const App = () => {
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  return (
    <div>
      <h1>give feedback</h1>

      <Button text='good' handleClick={() => setGood(good + 1)} />
      <Button text='neutral' handleClick={() => setNeutral(neutral + 1)} />
      <Button text='bad' handleClick={() => setBad(bad + 1)} />

      <h1>statistics</h1>

      {
        good === 0 && neutral === 0 && bad === 0
          ? <p>No feedback given</p>
          : <Statistics
            good={good}
            neutral={neutral}
            bad={bad}
            all={good + neutral + bad}
            average={(good - bad) / (good + neutral + bad)}
            positive={good * 100 / (good + neutral + bad) + ' %'}
          />
      }
    </div>
  )
}

export default App