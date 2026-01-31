// Needed Resources
const express = require("express")
const router = new express.Router()
const invController = require("../controllers/invController")  
const utilities = require("../utilities/")

// Route to build inventory by classification view
router.get(
	"/type/:classificationId",
	utilities.asyncHandler(invController.buildByClassificationId)
)

// Route to build vehicle detail view
router.get(
	"/detail/:inventoryId",
	utilities.asyncHandler(invController.buildByInventoryId)
)

module.exports = router;