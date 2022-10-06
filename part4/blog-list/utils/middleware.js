const jwt = require('jsonwebtoken')
const User = require('../models/user')

const tokenExtractor = (request, response, next) => {
    const authorization = request.get('authorization')
    const { url } = request

    if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
        request.token = authorization.substring(7)
    } else {
        if (!url.includes('login') && !url.includes('users')) {
            return response.status(401).json({
                message: 'Missing or invalid token'
            })
        }
    }

    next()
}

const userExtractor = async (request, response, next) => {
    const token = request.token
    
    if (!token) {
        return response.status(401).end()
    }

    const decodedToken = await jwt.verify(request.token, process.env.SECRET)
    const user = await User.findById(decodedToken.id)
    request.user = user

    next()
}

module.exports = {
    tokenExtractor,
    userExtractor
}