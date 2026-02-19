const { body, validationResult } = require("express-validator");
const utilities = require("../utilities/");
const accountModel = require("../models/account-model");

const loginRules = () => [
  body("account_email")
    .trim()
    .isEmail()
    .withMessage("Please provide a valid email address."),
  body("account_password")
    .trim()
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long."),
];

const accountUpdateRules = () => [
  body("account_firstname")
    .trim()
    .isLength({ min: 1 })
    .withMessage("First name is required.")
    .escape(),
  body("account_lastname")
    .trim()
    .isLength({ min: 1 })
    .withMessage("Last name is required.")
    .escape(),
  body("account_email")
    .trim()
    .isEmail()
    .withMessage("Please provide a valid email address.")
    .normalizeEmail(),
  body("account_id")
    .trim()
    .isInt({ min: 1 })
    .withMessage("Invalid account identifier."),
];

const passwordUpdateRules = () => [
  body("account_password")
    .trim()
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters long.")
    .matches(/[A-Z]/)
    .withMessage("Password must include at least one uppercase letter.")
    .matches(/[a-z]/)
    .withMessage("Password must include at least one lowercase letter.")
    .matches(/[0-9]/)
    .withMessage("Password must include at least one number."),
  body("account_id")
    .trim()
    .isInt({ min: 1 })
    .withMessage("Invalid account identifier."),
];

// Middleware functions...
async function checkLoginData(req, res, next) {
  /* unchanged */
}
async function checkAccountUpdateData(req, res, next) {
  /* unchanged */
}
async function checkPasswordData(req, res, next) {
  /* unchanged */
}

module.exports = {
  loginRules,
  checkLoginData,
  accountUpdateRules,
  passwordUpdateRules,
  checkAccountUpdateData,
  checkPasswordData,
};
