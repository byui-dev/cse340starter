// Needed Resources
const express = require("express");
const router = new express.Router();
const invController = require("../controllers/invController");
const utilities = require("../utilities/");
const invValidate = require("../utilities/inventory-validation");

// Route to build inventory management view
router.get("/", utilities.asyncHandler(invController.buildManagement));

// Route to build add classification view
router.get(
  "/add-class",
  utilities.asyncHandler(invController.buildAddClassification),
);

// Route to process add classification
router.post(
  "/add-class",
  utilities.asyncHandler(invController.addClassification),
);

// Route to build add inventory view
router.get(
  "/add-item",
  utilities.asyncHandler(invController.buildAddInventory),
);

// Route to process add inventory
router.post("/add-item", utilities.asyncHandler(invController.addInventory));

// Route to build inventory by classification view
router.get(
  "/type/:classificationId",
  utilities.asyncHandler(invController.buildByClassificationId),
);

// Route to build vehicle detail view
router.get(
  "/detail/:inventoryId",
  utilities.asyncHandler(invController.buildByInventoryId),
);

router.get(
  "/getInventory/:classification_id",
  utilities.asyncHandler(invController.getInventoryJSON),
);

// Route to build edit inventory view
router.get(
  "/edit/:inventoryId",
  utilities.asyncHandler(invController.buildEditInventory),
);

// Route to process inventory update
router.post(
  "/update-item",
  invValidate.inventoryRules(),
  invValidate.checkInventoryUpdateData,
  utilities.asyncHandler(invController.updateInventory),
);

// Route to build delete confirmation view
router.get(
  "/delete/:inventoryId",
  utilities.asyncHandler(invController.buildDeleteInventory),
);

// Route to process inventory deletion
router.post(
  "/delete-item",
  utilities.asyncHandler(invController.deleteInventory),
);

module.exports = router;
