const jwt = require('jsonwebtoken')
const User = require('../models/user')

const tokenExtractor = (request, response, next) => {
  const authorization = request.get('Authorization')
  const { url } = request

  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    request.token = authorization.substring(7)
  } else {
    if (!url.includes('login') && !url.includes('users')) {
      return response.status(401).json({
        message: 'Missing or invalid token!'
      })
    }
  }

  next()
}

const userExtractor = async (request, response, next) => {
  const decodedToken = jwt.verify(request.token, process.env.SECRET)
  if (!decodedToken.id) {
    return response.status(401).json({
      message: 'Please, provide a valid token!'
    })
  }

  const user = await User.findById(decodedToken.id)
  request.user = user

  next()
}

const errorHandler = (error, request, response, next) => {
  const catchErrorNames = [
    'ValidationError', 'CastError', 'MongoServerError'
  ]

  if (catchErrorNames.includes(error.name)) {
    if (error.message.includes('E11000 duplicate key error')) {
      return response.status(400).json({
        message: 'Expected `username` to be unique!'
      })
    }

    return response.status(400).json({ message: error.message })
  } else if (error.name === 'JsonWebTokenError') {
    return response.status(401).json({
      message: 'Please, provide a valid token!'
    })
  } else if (error.name === 'TokenExpiredError') {
    return response.status(401).json({
      message: 'Your token has been expired!'
    })
  }

  next(error)
}

module.exports = {
  tokenExtractor, userExtractor, errorHandler
}