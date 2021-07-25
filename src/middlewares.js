function jsonBodyValidatingMiddlewareFactory (validate) {
  return (req, res, next) => {
    const valid = validate(req.body)
    if (valid) {
      next()
    } else {
      return res.status(400).json({
        errorCode: 'INVALID_PAYLOAD',
        message: 'Please check the API documentation.',
        details: validate.errors
      })
    }
  }
}

module.exports = {
  jsonBodyValidatingMiddlewareFactory
}
