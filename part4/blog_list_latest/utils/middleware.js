const errorHandler = (error, request, response, next) => {
  const catchErrorNames = [
    'ValidationError', 'CastError'
  ]

  if (catchErrorNames.includes(error.name)) {
    return response.status(400).json({ message: error.message })
  }

  next(error)
}

module.exports = {
  errorHandler
}