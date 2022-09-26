const config = require('./utils/config')
const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
const blogsRoutes = require('./routes/blogs')

const app = express()

const dbUri = config.DB_URI
mongoose.connect(dbUri)

app.use(cors())
app.use(express.json())

app.use('/api/blogs', blogsRoutes)

module.exports = app