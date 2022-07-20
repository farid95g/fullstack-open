import Part from './Part'
import Total from './Total'

const Content = ({ parts }) => <>
    {parts.map(part => 
        <Part
            key={part.id}
            name={part.name}
            exercises={part.exercises}
        />
    )}
    <Total
        total={parts.reduce((total, part) => total + part.exercises, 0)}
    />
</>

export default Content