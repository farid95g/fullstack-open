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
    <div className='blog'>
      <div>
        <span className='title'>{blog.title}</span>
        <button onClick={() => setShowFullInfo(!showFullInfo)}>
          {showFullInfo ? 'hide' : 'view'}
        </button>
      </div>
      <div data-testid='hiddenContent' style={{ display: showFullInfo ? '' : 'none' }} data-username={user.username} data-blog-author={blog.user.username}>
        {blog.url}
        <br />
				likes <span data-testid='likes'>{blog.likes}</span>
        <button onClick={() => handleUpdate(blog)}>like</button>
        <br />
        <span>{blog.author}</span>
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
