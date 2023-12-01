import { useState } from 'react'

const Statistics = ({ good, neutral, bad }) => {
    return (
        <>
            <h1>statistics</h1>
            {!good && !neutral && !bad ? (
                <p>No feedback given</p>
            ) : (
                <table>
                    <tbody>
                        <StatisticLine
                            text='good'
                            value={good}
                        />
                        <StatisticLine
                            text='neutral'
                            value={neutral}
                        />
                        <StatisticLine
                            text='bad'
                            value={bad}
                        />
                        <StatisticLine
                            text='all'
                            value={good + neutral + bad}
                        />
                        <StatisticLine
                            text='average'
                            value={(good - bad) / (good + neutral + bad)}
                        />
                        <StatisticLine
                            text='positive'
                            value={`${(good * 100) / (good + neutral + bad)}%`}
                        />
                    </tbody>
                </table>
            )}
        </>
    )
}

const Button = ({ handleClick, text }) => (
    <button onClick={handleClick}>{text}</button>
)

const StatisticLine = ({ text, value }) => (
    <tr>
        <td>{text}</td>
        <td>{value}</td>
    </tr>
)

function App() {
    const [good, setGood] = useState(0)
    const [neutral, setNeutral] = useState(0)
    const [bad, setBad] = useState(0)

    return (
        <div>
            <h1>give feedback</h1>
            <Button
                handleClick={() => setGood(good + 1)}
                text='good'
            />
            <Button
                handleClick={() => setNeutral(neutral + 1)}
                text='neutral'
            />
            <Button
                handleClick={() => setBad(bad + 1)}
                text='bad'
            />
            <Statistics
                good={good}
                neutral={neutral}
                bad={bad}
            />
        </div>
    )
}

export default App
