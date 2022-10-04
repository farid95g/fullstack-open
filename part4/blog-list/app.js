const config = require('./utils/config')
const express = require('express')
require('express-async-errors')
const cors = require('cors')
const mongoose = require('mongoose')
const blogsRoutes = require('./routes/blogs')
const usersRoutes = require('./routes/users')
const loginRoutes = require('./routes/login')

const app = express()

const dbUri = config.DB_URI
mongoose.connect(dbUri)

app.use(cors())
app.use(express.json())

app.use('/api/blogs', blogsRoutes)
app.use('/api/users', usersRoutes)
app.use('/api/login', loginRoutes)

module.exports = app