import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import LoginForm from './components/LoginForm'
import loginService from './services/login'
import CreateBlogForm from './components/CreateBlogForm'
import jwt from 'jwt-decode'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [user, setUser] = useState({})
  const [error, setError] = useState('')

  useEffect(() => {
    if (localStorage.getItem('user')) {
      setUser(JSON.parse(localStorage.getItem('user')))
    }
  }, [])

  useEffect(() => {
    const fetchBlogs = async () => {
      if (Object.keys(user).length) {
        blogService.assignToken(user.token)
        const userBlogs = await blogService.getAll(user.token)
        setBlogs(userBlogs)
      }
    }
    fetchBlogs()
  }, [user])

  const login = async (userInfo) => {
    try {
      const loggedInUser = await loginService.login(userInfo)
      setUser(loggedInUser)
      localStorage.setItem('token', loggedInUser.token)
      localStorage.setItem('user', JSON.stringify(loggedInUser))
      blogService.assignToken(loggedInUser.token)
    } catch (e) {
      setError(e.response.data.message)
    }
  }

  const logout = () => {
    setUser({})
    localStorage.clear()
  }

  const createNewBlog = async (newBlog) => {
    const { id } = jwt(user.token)
    const savedBlog = await blogService.createNew({ ...newBlog, user: id })
    setBlogs([...blogs, savedBlog])
  }

  return (
    <div>
      {
        !Object.keys(user).length
          ? <LoginForm login={login} error={error} />
          : <>
              <h2>Blogs</h2>
              <p>
                {user.name} logged in <button onClick={logout}>logout</button>
              </p>
              <CreateBlogForm createNewBlog={createNewBlog} />
              {blogs.map(blog =>
                <Blog key={blog.id} blog={blog} />
              )}
            </>
      }
    </div>
  )
}

export default App
