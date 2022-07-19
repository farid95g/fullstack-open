import StatisticLine from './StatisticLine'

const Statistics = ({
    good,
    neutral,
    bad,
    all,
    average,
    positive
}) => (
    <table>
        <tbody>
            <StatisticLine text='good' count={good} />
            <StatisticLine text='neutral' count={neutral} />
            <StatisticLine text='bad' count={bad} />

            <StatisticLine text='all' count={all} />
            <StatisticLine text='average' count={average} />
            <StatisticLine text='positive' count={positive} />
        </tbody>
    </table>
)

export default Statistics