const { body, validationResult } = require("express-validator");
const utilities = require("../utilities/");
const accountModel = require("../models/account-model");

const loginRules = () => {
  return [
    body("account_email")
      .trim()
      .isEmail()
      .withMessage("Please provide a valid email address."),
    body("account_password")
      .trim()
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters long."),
  ];
};

const accountUpdateRules = () => {
  return [
    body("account_firstname")
      .trim()
      .notEmpty()
      .withMessage("First name is required."),
    body("account_lastname")
      .trim()
      .notEmpty()
      .withMessage("Last name is required."),
    body("account_email")
      .trim()
      .isEmail()
      .withMessage("Please provide a valid email address."),
    body("account_id")
      .trim()
      .isInt({ min: 1 })
      .withMessage("Invalid account identifier."),
  ];
};

const passwordUpdateRules = () => {
  return [
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
};
// Middleware to check validation results
async function checkLoginData(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const nav = await utilities.getNav();
    return res.render("account/login", {
      title: "Login",
      nav,
      message: req.flash("notice"),
      errors: errors.array(),
      account_email: req.body.account_email,
    });
  }
  next();
}

async function checkAccountUpdateData(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const nav = await utilities.getNav();
    return res.render("account/update", {
      title: "Update Account",
      nav,
      message: req.flash("notice"),
      errors: errors.array(),
      accountData: {
        account_id: req.body.account_id,
        account_firstname: req.body.account_firstname,
        account_lastname: req.body.account_lastname,
        account_email: req.body.account_email,
      },
    });
  }
  next();
}

async function checkPasswordData(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const nav = await utilities.getNav();
    const accountData = (await accountModel.getAccountById(
      req.body.account_id,
    )) || {
      account_id: req.body.account_id,
    };

    return res.render("account/update", {
      title: "Update Account",
      nav,
      message: req.flash("notice"),
      errors: errors.array(),
      accountData,
    });
  }
  next();
}

module.exports = {
  loginRules,
  checkLoginData,
  accountUpdateRules,
  passwordUpdateRules,
  checkAccountUpdateData,
  checkPasswordData,
};
