const config = require('./utils/config')
const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
const blogsRoutes = require('./routes/blogs')

const app = express()

const connectionString = config.CONNECTION_STRING
mongoose.connect(connectionString)

app.use(cors())
app.use(express.json())

app.use('/api/blogs', blogsRoutes)

module.exports = app