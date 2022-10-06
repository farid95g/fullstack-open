const express = require('express')
const usersController = require('../controllers/users')
const middleware = require('../utils/middleware')

const usersRouter = express.Router()

usersRouter
    .route('/')
    .get(middleware.tokenExtractor, usersController.getAllUsers)
    .post(usersController.createUser)

module.exports = usersRouter