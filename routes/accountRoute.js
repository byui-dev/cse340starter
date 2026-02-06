// Needed Resources
const express = require("express")
const router = new express.Router()
const accountsController = require("../controllers/accountsController")  
const utilities = require("../utilities/")

// Add a "GET" route for the path that will be sent when the "My Account" link is clicked
router.get("/", 
  utilities.asyncHandler(accountsController.buildAccountManagementView),
  (err, req, res, next) => {
    console.error("Account route error: ", err.message)
    res.status(err.status || 500).render("errors/error", {
      title: "Account Error",
      message: err.message,
    })
  }
)

// Add a "GET" route for login
router.get("/login",
  utilities.asyncHandler(accountsController.buildLogin)
)  

// Add a "GET" route for registration
router.get("/register",
  utilities.asyncHandler(accountsController.buildRegister)
)

// Add a "POST" route for registration
router.post("/register", utilities.handleErrors(accountsController.registerAccount))

module.exports = router;