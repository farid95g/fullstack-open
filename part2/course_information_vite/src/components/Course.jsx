export const Course = ({ course }) => {
    return (
        <div>
            <Header course={course.name} />
            <Content parts={course.parts} />
            <Total
                sum={course.parts.reduce(
                    (total, part) => total + part.exercises,
                    0
                )}
            />
        </div>
    )
}

const Header = ({ course }) => {
    return <h2>{course}</h2>
}

const Total = ({ sum }) => <h4>total of {sum} exercises</h4>

const Content = ({ parts }) => {
    return (
        <>
            {parts.map((part) => (
                <Part
                    part={part}
                    key={part.id}
                />
            ))}
        </>
    )
}

const Part = ({ part }) => {
    return (
        <p>
            {part.name} {part.exercises}
        </p>
    )
}
