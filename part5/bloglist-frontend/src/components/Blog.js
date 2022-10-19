import { useState } from 'react'

const Blog = ({ blog, updateBlog }) => {
  const [extended, setExtended] = useState(false)

  const show = { display: extended ? '' : 'none' }
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  return (
    <div style={blogStyle}>
      <div>
        {blog.title} {blog.author}
        <button onClick={() => setExtended(!extended)}>
          { extended ? 'Hide' : 'View' }
        </button>
      </div>
      <div style={show}>
        {blog.url}<br />
        likes {blog.likes}
        <button
          onClick={() => updateBlog(blog)}
        >
          Like
        </button><br />
        {blog.user.name}
      </div>
    </div>
  )
}

export default Blog