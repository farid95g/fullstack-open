import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import { Togglable } from './components/Togglable'
import { BlogForm } from './components/BlogForm'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [notification, setNotification] = useState(null)
  const blogFormRef = useRef()

  useEffect(() => {
    const loggedUserJSON =
			window.localStorage.getItem('loggedBlogsAppUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  useEffect(() => {
    const fetchBlogs = async () => {
      const blogs = await blogService.getAll()
      setBlogs(blogs)
    }

    if (user) fetchBlogs()
  }, [user])

  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const user = await loginService.login({
        username,
        password
      })

      window.localStorage.setItem(
        'loggedBlogsAppUser',
        JSON.stringify(user)
      )
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
    } catch (e) {
      setNotification({
        message: e.response.data.message,
        type: 'error'
      })
      setTimeout(() => {
        setNotification(null)
      }, 5000)
    }
  }

  const logout = () => {
    window.localStorage.removeItem('loggedBlogsAppUser')
    blogService.setToken(null)
    setUser(null)
  }

  const handleCreateNewBlog = async (newBlog) => {
    try {
      const createdBlog = await blogService.create(newBlog)
      blogFormRef.current.toggleVisibility()
      setBlogs([...blogs, createdBlog])
      setNotification({
        message: `A new blog ${newBlog.title} by ${newBlog.author} added`,
        type: 'success'
      })
      setTimeout(() => {
        setNotification(null)
      }, 5000)
    } catch (e) {
      console.log(e)
    }
  }

  const loginForm = () => (
    <form onSubmit={handleLogin}>
      <h2>Login to application</h2>
      <div>
				username
        <input
          type='text'
          value={username}
          onChange={({ target }) => setUsername(target.value)}
        />
      </div>
      <div>
				password
        <input
          type='password'
          value={password}
          onChange={({ target }) => setPassword(target.value)}
        />
      </div>
      <button type='submit'>login</button>
    </form>
  )

  const createBlogForm = () => (
    <Togglable buttonLabel='Create new blog' ref={blogFormRef}>
      <BlogForm handleCreateNewBlog={handleCreateNewBlog} />
    </Togglable>
  )

  const updateBlog = async updatedBlog => {
    try {
      const response = await blogService.update(updatedBlog)
      setBlogs(blogs.map(blog => {
        if (blog.id === response.id) {
          return response
        }

        return blog
      }))
    } catch (e) {
      console.log(e)
    }
  }

  const removeBlog = async id => {
    try {
      await blogService.remove(id)
      setBlogs(blogs.filter(blog => blog.id !== id))
    } catch (e) {
      console.log(e)
    }
  }

  return (
    <div>
      {notification && (
        <div
          style={{
            backgroundColor: 'gray',
            color: notification.type === 'success' ? '#00FF00' : '#FF0000',
            border: notification.type === 'success' ? '1px solid #00FF00' : '1px solid #FF0000',
            padding: '1rem',
            borderRadius: 5
          }}
        >
          {notification.message}
        </div>
      )}
      {user === null ? (
        loginForm()
      ) : (
        <div>
          <h2>Blogs</h2>
          <p>
            {user.name} logged in
            <button onClick={logout}>logout</button>
          </p>
          {createBlogForm()}
          {[...blogs].sort((b1, b2) => b2.likes - b1.likes).map((blog) => (
            <Blog
              key={blog.id}
              blog={blog}
              updateBlog={updateBlog}
              user={user}
              removeBlog={removeBlog}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default App
