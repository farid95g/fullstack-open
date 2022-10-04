const express = require('express')
const loginController = require('../controllers/login')

const loginRouter = express.Router()

loginRouter
    .route('/')
    .post(loginController.login)

module.exports = loginRouter