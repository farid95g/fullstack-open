const tokenExtractor = (request, response, next) => {
    const authorization = request.get('authorization')

    if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
        request.token = authorization.substring(7)
    } else {
        if (!request.url.includes('/login')) {
            return response.status(401).json({
                message: 'Missing or invalid token'
            })
        }
    }

    next()
}

module.exports = {
    tokenExtractor
}