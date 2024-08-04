import { useState } from 'react'
import PropTypes from 'prop-types'

export const BlogForm = ({ handleCreateNewBlog }) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  const createBlog = (event) => {
    event.preventDefault()
    handleCreateNewBlog({
      title,
      author,
      url
    })
    setTitle('')
    setAuthor('')
    setUrl('')
  }

  return (
    <form onSubmit={createBlog}>
      <h2>Create new blog post</h2>
      <div>
				title
        <input
          type='text'
          value={title}
          placeholder='Enter a title'
          onChange={({ target }) => setTitle(target.value)}
        />
      </div>
      <div>
				author
        <input
          type='text'
          value={author}
          placeholder='Enter an author'
          onChange={({ target }) => setAuthor(target.value)}
        />
      </div>
      <div>
				url
        <input
          type='url'
          value={url}
          placeholder='Enter an url'
          onChange={({ target }) => setUrl(target.value)}
        />
      </div>
      <button type='submit'>Create</button>
    </form>
  )
}

BlogForm.propTypes = {
  handleCreateNewBlog: PropTypes.func.isRequired
}
