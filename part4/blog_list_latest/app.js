const { MONGODB_URI } = require('./utils/config')
const express = require('express')
require('express-async-errors')
const cors = require('cors')
const mongoose = require('mongoose')
const blogsRouter = require('./controllers/blog')
const middleware = require('./utils/middleware')

const app = express()

mongoose.connect(MONGODB_URI)

app.use(cors())
app.use(express.json())

app.use('/api/blogs', blogsRouter)
app.use(middleware.errorHandler)

module.exports = app