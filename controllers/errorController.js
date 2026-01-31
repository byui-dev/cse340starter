const errorController = {}

// Controller that intentionally throws an error to test error handling
errorController.triggerError = async function (req, res, next) {
  // create an intentional server error
  throw new Error("Intentional server error for testing (500)")
}

module.exports = errorController
