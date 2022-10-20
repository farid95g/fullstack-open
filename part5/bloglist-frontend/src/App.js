import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import LoginForm from './components/LoginForm'
import loginService from './services/login'
import CreateBlogForm from './components/CreateBlogForm'
import jwt from 'jwt-decode'
import Togglable from './components/Togglable'

const App = () => {
    const [blogs, setBlogs] = useState([])
    const [user, setUser] = useState({})
    const [notification, setNotification] = useState(null)
    const newBlogFormRef = useRef()

    const toggleNotification = notification => {
        setNotification(notification)
        setTimeout(() => setNotification(null), 5000)
    }

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
            toggleNotification({ message: e.response.data.message, status: 'error' })
        }
    }

    const logout = () => {
        setUser({})
        localStorage.clear()
    }

    const createNewBlog = async (newBlog) => {
        newBlogFormRef.current.toggleVisibility()
        const { id } = jwt(user.token)
        const savedBlog = await blogService.createNew({ ...newBlog, user: id })
        setBlogs([...blogs, savedBlog])
        toggleNotification({ message: `A new blog '${savedBlog.title} ${savedBlog.author}' added.`, status: 'success' })
    }

    const updateBlog = async (blog) => {
        const updatedBlog = await blogService.updateBlog({
            ...blog,
            user: blog.user.id,
            likes: blog.likes + 1
        })

        setBlogs(blogs.map(b => {
            if (b.id !== blog.id) {
                return b
            }

            return updatedBlog
        }))
    }

    const removeBlog = async (blog) => {
        const confirmed = window.confirm(`Remove blog ${blog.title} by ${blog.author}`)
        if (confirmed) {
            const status = await blogService.deleteBlog(blog)
            if (status === 204) {
                setBlogs(blogs.filter(b => b.id !== blog.id))
            }
        }
    }

    return (
        <div>
            {
                notification
                    ? <div
                        className='notification'
                        style={{
                            backgroundColor: 'lightgray',
                            padding: '.5rem 1rem',
                            border: '2px solid',
                            borderColor: notification?.status === 'success' ? 'green' : 'red',
                            color: notification?.status === 'success' ? 'green' : 'red',
                            borderRadius: '5px'
                        }}
                    >
                        <span>{notification?.message}</span>
                    </div> : null
            }
            {
                !Object.keys(user).length
                    ? <LoginForm login={login} />
                    : <>
                        <h2>Blogs</h2>
                        <p>
                            {user.name} logged in <button onClick={logout}>logout</button>
                        </p>
                        <Togglable buttonLabel='New note' ref={newBlogFormRef}>
                            <CreateBlogForm createNewBlog={createNewBlog} />
                        </Togglable>
                        {blogs.sort((b1, b2) => b2.likes - b1.likes).map(blog =>
                            <Blog
                                key={blog.id}
                                blog={blog}
                                updateBlog={updateBlog}
                                removeBlog={removeBlog}
                                userId={jwt(user.token)?.id}
                            />
                        )}
                    </>
            }
        </div>
    )
}

export default App
