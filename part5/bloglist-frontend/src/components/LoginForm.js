import React, { useState } from 'react'

const LoginForm = ({ login, error }) => {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')

    const submit = e => {
        e.preventDefault()
        login({ username, password })
    }

    return (
        <div>
            <h1>Log in to application</h1>
            {error && <span style={{color: 'red'}}>{error}</span>}
            <form onSubmit={submit}>
                <div>
                    <label>username</label>
                    <input
                        type='text'
                        value={username}
                        onChange={e => setUsername(e.target.value)}
                    />
                </div>
                <div>
                    <label>password</label>
                    <input
                        type='password'
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                    />
                </div>
                <div>
                    <button type='submit'>Login</button>
                </div>
            </form>
        </div>
    )
}

export default LoginForm
