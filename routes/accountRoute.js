// Needed Resources
const express = require("express");
const router = new express.Router();
const regvalidate = require("../utilities/account-validation");
const accountsController = require("../controllers/accountsController");
const utilities = require("../utilities/");

router.get(
  "/",
  utilities.checkLogin,
  utilities.asyncHandler(accountsController.buildAccountManagementView),
);

// Add a "GET" route for login view
router.get("/login", utilities.asyncHandler(accountsController.buildLogin));

// Add a "POST" route for login
router.post(
  "/login",
  regvalidate.loginRules(),
  regvalidate.checkLoginData,
  utilities.asyncHandler(accountsController.accountLogin),
);

// Add a "GET" route for registration
router.get(
  "/register",
  utilities.asyncHandler(accountsController.buildRegister),
);

// Add a "POST" route for registration
router.post(
  "/register",
  utilities.asyncHandler(accountsController.registerAccount),
);

router.get("/logout", utilities.asyncHandler(accountsController.logout));

router.get(
  "/update/:accountId",
  utilities.checkLogin,
  utilities.asyncHandler(accountsController.buildUpdateAccount),
);

router.post(
  "/update/info",
  utilities.checkLogin,
  regvalidate.accountUpdateRules(),
  regvalidate.checkAccountUpdateData,
  utilities.asyncHandler(accountsController.updateAccountInfo),
);

router.post(
  "/update/password",
  utilities.checkLogin,
  regvalidate.passwordUpdateRules(),
  regvalidate.checkPasswordData,
  utilities.asyncHandler(accountsController.updateAccountPassword),
);

module.exports = router;
