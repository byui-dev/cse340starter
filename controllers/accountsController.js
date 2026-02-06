const utilities = require("../utilities")

/*******************************
 * Deliver login view
 * ****************************/
async function buildLogin(req, res, next) {
  try {
    let nav = await utilities.getNav()  
    res.render("account/login", {
        title: "Login",
        nav,
        message: req.flash("notice"),
        errors: null
    })      
  } catch (err) {
    next(err)
  }
}  

/*******************************
 * Deliver registration view
 * ****************************/
async function buildRegister(req, res, next) {
  try {
    let nav = await utilities.getNav()
    res.render("account/register", {
        title: "Register",
        nav,
        message: req.flash("notice"),
        errors: null
    })      
  } catch (err) {
    next(err)
  }
}  

module.exports = { buildLogin, buildRegister }