const errorHandler = (error, request, response, next) => {
  if (error.name === 'ValidationError') {
    return response.status(400).json({ message: error.message })
  }

  next(error)
}

module.exports = {
  errorHandler
}