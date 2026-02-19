const { body, validationResult } = require("express-validator");
const utilities = require("../utilities/");

function inventoryRules() {
  return [
    body("inv_make")
      .trim()
      .notEmpty()
      .withMessage("Make is required.")
      .escape(),
    body("inv_model")
      .trim()
      .notEmpty()
      .withMessage("Model is required.")
      .escape(),
    body("inv_year")
      .trim()
      .isLength({ min: 4, max: 4 })
      .withMessage("Year must be 4 digits.")
      .isInt({ min: 1900, max: 2099 })
      .withMessage("Year must be between 1900 and 2099."),
    body("inv_description")
      .trim()
      .notEmpty()
      .withMessage("Description is required.")
      .escape(),
    body("inv_image")
      .trim()
      .notEmpty()
      .withMessage("Image path is required.")
      .escape(),
    body("inv_thumbnail")
      .trim()
      .notEmpty()
      .withMessage("Thumbnail path is required.")
      .escape(),
    body("inv_price")
      .trim()
      .isFloat({ min: 0 })
      .withMessage("Price must be a positive number."),
    body("inv_miles")
      .trim()
      .isInt({ min: 0 })
      .withMessage("Miles must be a positive whole number."),
    body("inv_color")
      .trim()
      .notEmpty()
      .withMessage("Color is required.")
      .escape(),
    body("classification_id")
      .trim()
      .notEmpty()
      .withMessage("Classification is required.")
      .escape(),
  ];
}

async function checkInventoryData(req, res, next) {
  const errors = validationResult(req);
  const {
    inv_make,
    inv_model,
    inv_year,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_miles,
    inv_color,
    classification_id,
  } = req.body;

  if (!errors.isEmpty()) {
    const nav = await utilities.getNav();
    const classificationList =
      await utilities.buildClassificationList(classification_id);
    return res.render("inventory/add-inventory", {
      title: "Add Inventory",
      nav,
      classificationList,
      message: req.flash("notice"),
      errors: errors.array(),
      inv_make,
      inv_model,
      inv_year,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_miles,
      inv_color,
      classification_id,
    });
  }
  next();
}

async function checkInventoryUpdateData(req, res, next) {
  const errors = validationResult(req);
  const {
    inv_id,
    inv_make,
    inv_model,
    inv_year,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_miles,
    inv_color,
    classification_id,
  } = req.body;

  if (!errors.isEmpty()) {
    const nav = await utilities.getNav();
    const classificationList =
      await utilities.buildClassificationList(classification_id);
    return res.render("inventory/edit-inventory", {
      title: `Edit ${inv_make} ${inv_model}`,
      nav,
      classificationList,
      message: req.flash("notice"),
      errors: errors.array(),
      inv_id,
      inv_make,
      inv_model,
      inv_year,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_miles,
      inv_color,
      classification_id,
    });
  }
  next();
}

module.exports = {
  inventoryRules,
  checkInventoryData,
  checkInventoryUpdateData,
};
