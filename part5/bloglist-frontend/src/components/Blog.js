import { useState } from 'react'
import PropTypes from 'prop-types'

const Blog = ({ blog, updateBlog, removeBlog, userId }) => {
    const [extended, setExtended] = useState(false)

    const show = { display: extended ? '' : 'none' }
    const blogStyle = {
        paddingTop: 10,
        paddingLeft: 2,
        border: 'solid',
        borderWidth: 1,
        marginBottom: 5,
    }

    return (
        <div style={blogStyle}>
            <div>
                {blog.title} {blog.author}
                <button onClick={() => setExtended(!extended)}>
                    {extended ? 'Hide' : 'View'}
                </button>
            </div>
            <div style={show}>
                {blog.url}
                <br />
                likes {blog.likes}
                <button onClick={() => updateBlog(blog)}>Like</button>
                <br />
                {blog.user.name}
                <br />
                {userId === blog.user.id && (
                    <button onClick={() => removeBlog(blog)}>Remove</button>
                )}
            </div>
        </div>
    )
}

Blog.propTypes = {
    blog: PropTypes.shape({
        title: PropTypes.string.isRequired,
        author: PropTypes.string.isRequired,
        url: PropTypes.string.isRequired,
        likes: PropTypes.number.isRequired,
        id: PropTypes.string.isRequired,
        user: PropTypes.shape({
            id: PropTypes.string.isRequired,
            name: PropTypes.string.isRequired,
            username: PropTypes.string.isRequired,
        }),
    }),
    updateBlog: PropTypes.func.isRequired,
    removeBlog: PropTypes.func,
    userId: PropTypes.string.isRequired,
}

export default Blog
