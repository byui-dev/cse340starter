const { body, validationResult } = require("express-validator")
const utilities = require("../utilities/")

const loginRules = () => {
    return [
    body("account_email")
            .trim()
            .isEmail()
            .withMessage("Please provide a valid email address."),
    body("account_password")
            .trim()
            .isLength({ min: 6 })
            .withMessage("Password must be at least 6 characters long.")    
    ]
}
// Middleware to check validation results
async function checkLoginData(req, res, next) {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    const nav = await utilities.getNav()
    return res.render("account/login", {
      title: "Login",
      nav,
      message: req.flash("notice"),
      errors: errors.array(),
      account_email: req.body.account_email
    })   
  }   
  next()  
}
    
module.exports = { loginRules, checkLoginData }