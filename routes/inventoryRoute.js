// Needed Resources
const express = require("express");
const router = new express.Router();
const invController = require("../controllers/invController");
const utilities = require("../utilities/");
const invValidate = require("../utilities/inventory-validation");
const { checkAccountType } = require("../utilities/auth-middleware");
const apiController = require("../controllers/apiController");

// Route to build inventory management view (Admin only)
router.get("/", checkAccountType, utilities.asyncHandler(invController.buildManagement));

// Route to build add classification view (Admin only)
router.get(
  "/add-class",
  checkAccountType,
  utilities.asyncHandler(invController.buildAddClassification),
);

// Route to process add classification (Admin only)
router.post(
  "/add-class",
  checkAccountType,
  utilities.asyncHandler(invController.addClassification),
);

// Route to build add inventory view (Admin only)
router.get(
  "/add-item",
  checkAccountType,
  utilities.asyncHandler(invController.buildAddInventory),
);

// Route to process add inventory (Admin only)
router.post(
  "/add-item",
  checkAccountType,
  utilities.asyncHandler(invController.addInventory),
);

// Route to build inventory by classification view (Public)
router.get(
  "/type/:classificationId",
  utilities.asyncHandler(invController.buildByClassificationId),
);

// Route to build vehicle detail view (Public)
router.get(
  "/detail/:inventoryId",
  utilities.asyncHandler(invController.buildByInventoryId),
);

router.get(
  "/getInventory/:classification_id",
  utilities.asyncHandler(invController.getInventoryJSON),
);

// Route to build edit inventory view  (Admin only)
router.get(
  "/edit/:inventoryId",
  checkAccountType,
  utilities.asyncHandler(invController.buildEditInventory),
);

// Route to process inventory update (Admin only)
router.post(
  "/update-item",
  checkAccountType,
  invValidate.inventoryRules(),
  invValidate.checkInventoryUpdateData,
  utilities.asyncHandler(invController.updateInventory),
);

// Route to build delete confirmation view (Admin only)
router.get(
  "/delete/:inventoryId",
  checkAccountType,
  utilities.asyncHandler(invController.buildDeleteInventory),
);

// Route to process inventory deletion (Admin only)
router.post(
  "/delete-item",
  checkAccountType,
  utilities.asyncHandler(invController.deleteInventory),
);

router.get('/api', utilities.asyncHandler(apiController.listInventoryJSON));

module.exports = router;
