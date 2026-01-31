/* ******************************************
 * This server.js file is the primary file of the 
 * application. It is used to control the project.
 *******************************************/
/* ***********************
 * Require Statements
 *************************/
const express = require("express")
const expressLayouts = require("express-ejs-layouts")
const env = require("dotenv").config()
const app = express()
const static = require("./routes/static")
const baseController = require("./controllers/baseController")
const inventoryRoute = require("./routes/inventoryRoute")
const errorRoute = require("./routes/errorRoute")
const utilities = require("./utilities/")


/* ***********************
 * View Engine and Templates
 *************************/
app.set("view engine", "ejs")
app.use(expressLayouts)
app.set("layout", "./layouts/layout") // not at views root


/* ***********************
 * Routes
 *************************/
app.use(static)

// Index route (wrapped to forward async errors)
app.get("/", utilities.asyncHandler(baseController.buildHome))

// Inventory routes
app.use("/inv", inventoryRoute)

// Error testing route
app.use("/error", errorRoute)

/***********************************
 * File Not Found Route - must be the last route in list
 * Place after all other routes
 * Unit 3, Basic Error Handling Activity
 ***********************************/
app.use(async (req, res, next) => {
  next({ status: 404, message: "Sorry, we couldn't find this page." });
});

/***************************
 * Express Error Handler
 * Place after all other middleware 
 **************************/
app.use(async (err, req, res, next) => {
  try {
    let nav = await utilities.getNav()
    console.error(`Error at: ${req.originalUrl}: ${err.message}`)
    res.render("errors/error", {
      title: err.status || "Error",
      message: err.message,
      nav
    })
  } catch (error) {
    console.error("Error building navigation: ", error.message)
    res.status(err.status || 500).send("err.message")
  }
})

/* ***********************
 * Local Server Information
 * Values from .env (environment) file
 *************************/
const port = process.env.PORT || 3000

/* ***********************
 * Log statement to confirm server operation
 *************************/
app.listen(port, () => {
  console.log(`app listening on ${port}`)
})
