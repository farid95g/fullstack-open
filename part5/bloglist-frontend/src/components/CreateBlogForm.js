import React, { useState } from 'react'

const CreateBlogForm = ({ createNewBlog }) => {
    const [title, setTitle] = useState('')
    const [author, setAuthor] = useState('')
    const [url, setUrl] = useState('')

    const submit = e => {
        e.preventDefault()
        createNewBlog({
            title, author, url
        })
        setTitle('')
        setAuthor('')
        setUrl('')
    }

    return (
        <div>
            <h2>Create new</h2>
            <form onSubmit={submit}>
                <div>
                    <label>title</label>
                    <input
                        type='text'
                        value={title}
                        onChange={e => setTitle(e.target.value)}
                    />
                </div>
                <div>
                    <label>author</label>
                    <input
                        type='text'
                        value={author}
                        onChange={e => setAuthor(e.target.value)}
                    />
                </div>
                <div>
                    <label>url</label>
                    <input
                        type='url'
                        value={url}
                        onChange={e => setUrl(e.target.value)}
                    />
                </div>
                <div>
                    <button type='submit'>create</button>
                </div>
            </form>
        </div>
    )
}

export default CreateBlogForm