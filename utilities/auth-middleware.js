const jwt = require("jsonwebtoken")

function checkAccountType(req, res, next) {
    try {
        // Get token from cookie
        const token = req.cookies.jwt
        if (!token) {
            req.flash("notice", "You must be logged in to access this page.")
            return res.redirect("/account/login")
        }
      
        // Verify token    
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
    
        // Check account type
        if (decoded.account_type === "Employee" || decoded.account_type !== "Admin") {
            // Allow access
            next()
        } else {
            req.flash("notice", "Access denied. Employee or Admin type required.")
            return res.redirect("/account/login")
        }
    } catch (err) {
      console.error("Authorization error: ", err.message)
      req.flash("notice", "Please log in again.")
      return res.redirect("/account/login")
    }
}

module.exports = { checkAccountType }