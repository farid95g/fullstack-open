import { useState } from 'react'
import PropTypes from 'prop-types'

const Blog = ({ blog, updateBlog, user, removeBlog }) => {
  const [showFullInfo, setShowFullInfo] = useState(false)

  const handleUpdate = (blog) => {
    updateBlog({
      author: blog.author,
      id: blog.id,
      likes: blog.likes + 1,
      url: blog.url,
      user: blog.user.id
    })
  }

  const handleRemove = (blog) => {
    const shouldRemove = window.confirm(
      `Remove blog ${blog.title} by ${blog.author}`
    )
    if (shouldRemove) {
      removeBlog(blog.id)
    }
  }

  return (
    <div>
      <div>
        {blog.title}
        <button onClick={() => setShowFullInfo(!showFullInfo)}>
          {showFullInfo ? 'hide' : 'view'}
        </button>
      </div>
      <div style={{ display: showFullInfo ? '' : 'none' }}>
        {blog.url}
        <br />
				likes {blog.likes}
        <button onClick={() => handleUpdate(blog)}>like</button>
        <br />
        {blog.author}
        <br />
        {blog.user.username === user.username && (
          <button onClick={() => handleRemove(blog)}>Remove</button>
        )}
      </div>
    </div>
  )
}

Blog.propTypes = {
  blog: PropTypes.shape({
    author: PropTypes.string.isRequired,
    createdAt: PropTypes.string.isRequired,
    id: PropTypes.string.isRequired,
    likes: PropTypes.number.isRequired,
    title: PropTypes.string.isRequired,
    updatedAt: PropTypes.string.isRequired,
    url: PropTypes.string.isRequired,
    user: PropTypes.shape({
      username: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      id: PropTypes.string.isRequired
    })
  }),
  updateBlog: PropTypes.func.isRequired,
  user: PropTypes.shape({
    name: PropTypes.string.isRequired,
    token: PropTypes.string.isRequired,
    username: PropTypes.string.isRequired
  }),
  removeBlog: PropTypes.func.isRequired
}

export default Blog
