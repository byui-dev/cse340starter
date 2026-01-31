const express = require('express')
const router = new express.Router()
const errorController = require('../controllers/errorController')
const utilities = require('../utilities/')

// Route that triggers an intentional server error
router.get('/trigger', utilities.asyncHandler(errorController.triggerError))

// Router-level error handler: render error view for errors from this router
router.use(function (err, req, res, next) {
  // ensure we have a nav before rendering
  utilities.getNav().then((nav) => {
    console.error(`Router-level error at ${req.originalUrl}: ${err.message}`)
    res.status(err.status || 500).render('errors/error', {
      title: err.status || 'Server Error',
      message: err.message,
      nav,
    })
  }).catch((navErr) => {
    console.error('Error building nav for error route:', navErr.message)
    res.status(err.status || 500).render('errors/error', {
      title: err.status || 'Server Error',
      message: err.message,
      nav: '',
    })
  })
})

module.exports = router
