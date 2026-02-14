const utilities = require("../utilities");
const accountModel = require("../models/account-model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

/**
 * Determine whether the current user can modify the requested account
 */
function userCanModifyAccount(req, targetAccountId) {
  const sessionAccountId = Number(req.session.account_id);
  const sessionAccountType = req.session.account_type;

  if (!sessionAccountId || Number.isNaN(Number(targetAccountId))) {
    return false;
  }

  if (sessionAccountId === Number(targetAccountId)) {
    return true;
  }

  return sessionAccountType === "Employee" || sessionAccountType === "Admin";
}

/*******************************
 * Deliver login view
 * ****************************/
async function buildLogin(req, res, next) {
  try {
    let nav = await utilities.getNav();
    res.render("account/login", {
      title: "Login",
      nav,
      message: req.flash("notice"),
      errors: null,
    });
  } catch (err) {
    next(err);
  }
}

/*******************************
 * Deliver registration view
 * ****************************/
async function buildRegister(req, res, next) {
  try {
    let nav = await utilities.getNav();
    res.render("account/register", {
      title: "Register",
      nav,
      message: req.flash("notice"),
      errors: null,
    });
  } catch (err) {
    next(err);
  }
}

/******************************************
 * Process Registration
 * ***************************************/
async function registerAccount(req, res) {
  let nav = await utilities.getNav();
  const {
    account_firstname,
    account_lastname,
    account_email,
    account_password,
  } = req.body;

  const hashedPassword = await bcrypt.hash(account_password, 10);

  const regResult = await accountModel.registerAccount(
    account_firstname,
    account_lastname,
    account_email,
    hashedPassword,
  );

  if (regResult) {
    req.flash(
      "notice",
      `Congratulations, you're registered ${account_firstname}. Please log in.`,
    );
    res.status(201).render("account/login", {
      title: "Login",
      nav,
      message: req.flash("notice"),
      errors: null,
    });
  } else {
    req.flash("notice", "Sorry, the registration failed.");
    res.status(501).render("account/register", {
      title: "Registration",
      nav,
      message: req.flash("notice"),
      errors: null,
    });
  }
}

/*******************************************
 * Process login request
 * ******************************************/
async function accountLogin(req, res) {
  let nav = await utilities.getNav();
  const { account_email, account_password } = req.body;
  const accountData = await accountModel.getAccountByEmail(account_email);
  if (!accountData) {
    req.flash("notice", "Please check your credentials and try again.");
    res.status(400).render("account/login", {
      title: "Login",
      nav,
      message: req.flash("notice"),
      errors: null,
      account_email,
    });
    return;
  }
  try {
    if (await bcrypt.compare(account_password, accountData.account_password)) {
      delete accountData.account_password;

      // Explicitly include only the fields needed in the JWT
      const accessToken = jwt.sign(
        {
          account_id: accountData.account_id,
          account_firstname: accountData.account_firstname,
          account_lastname: accountData.account_lastname,
          account_email: accountData.account_email,
          account_type: accountData.account_type,
        },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: "1h" },
      );

      // Set cookie
      res.cookie("jwt", accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV !== "development",
        maxAge: 3600 * 1000,
      });

      // Save login state and user info in session
      req.session.isLoggedIn = true;
      req.session.account_id = accountData.account_id;
      req.session.account_firstname = accountData.account_firstname;
      req.session.account_lastname = accountData.account_lastname;
      req.session.account_type = accountData.account_type;
      req.session.account_email = accountData.account_email;

      return res.redirect("/account/");
    } else {
      req.flash("notice", "Please check your credentials and try again.");
      res.status(400).render("account/login", {
        title: "Login",
        nav,
        message: req.flash("notice"),
        errors: null,
        account_email,
      });
    }
  } catch (error) {
    throw new Error("Access Forbidden");
  }
}

// Build account management view
async function buildAccountManagementView(req, res, next) {
  try {
    let nav = await utilities.getNav();
    res.render("account/accountManagement", {
      title: "Account Management",
      nav,
      message: req.flash("notice"),
      errors: null,
      account_firstname: req.session.account_firstname,
      account_id: req.session.account_id,
      account_type: req.session.account_type,
    });
  } catch (err) {
    next(err);
  }
}

async function buildUpdateAccount(req, res, next) {
  try {
    const accountId = Number(req.params.accountId);

    if (!userCanModifyAccount(req, accountId)) {
      req.flash("notice", "You do not have permission to modify that account.");
      return res.redirect("/account/");
    }

    const nav = await utilities.getNav();
    const accountData = await accountModel.getAccountById(accountId);

    if (!accountData) {
      req.flash("notice", "Unable to find that account.");
      return res.redirect("/account/");
    }

    res.render("account/update", {
      title: "Update Account",
      nav,
      message: req.flash("notice"),
      errors: null,
      accountData,
    });
  } catch (err) {
    next(err);
  }
}

async function updateAccountInfo(req, res, next) {
  try {
    const accountId = Number(req.body.account_id);

    if (!userCanModifyAccount(req, accountId)) {
      req.flash("notice", "You do not have permission to modify that account.");
      return res.redirect("/account/");
    }

    const { account_firstname, account_lastname, account_email } = req.body;

    const existingEmailOwner =
      await accountModel.getAccountByEmail(account_email);

    if (
      existingEmailOwner &&
      Number(existingEmailOwner.account_id) !== Number(accountId)
    ) {
      const nav = await utilities.getNav();
      req.flash("notice", "That email address is already in use.");
      return res.render("account/update", {
        title: "Update Account",
        nav,
        message: req.flash("notice"),
        errors: null,
        accountData: {
          account_id: accountId,
          account_firstname,
          account_lastname,
          account_email,
        },
      });
    }

    const updatedAccount = await accountModel.updateAccountInfo(
      accountId,
      account_firstname,
      account_lastname,
      account_email,
    );

    if (!updatedAccount) {
      const nav = await utilities.getNav();
      req.flash("notice", "Account update failed. Please try again.");
      return res.render("account/update", {
        title: "Update Account",
        nav,
        message: req.flash("notice"),
        errors: null,
        accountData: {
          account_id: accountId,
          account_firstname,
          account_lastname,
          account_email,
        },
      });
    }

    req.session.account_firstname = updatedAccount.account_firstname;
    req.session.account_lastname = updatedAccount.account_lastname;
    req.session.account_email = updatedAccount.account_email;

    req.flash("notice", "Account information updated successfully.");
    return res.redirect("/account/");
  } catch (err) {
    next(err);
  }
}

async function updateAccountPassword(req, res, next) {
  try {
    const accountId = Number(req.body.account_id);

    if (!userCanModifyAccount(req, accountId)) {
      req.flash("notice", "You do not have permission to modify that account.");
      return res.redirect("/account/");
    }

    const hashedPassword = await bcrypt.hash(req.body.account_password, 10);
    const passwordUpdated = await accountModel.updateAccountPassword(
      accountId,
      hashedPassword,
    );

    if (!passwordUpdated) {
      const nav = await utilities.getNav();
      const accountData = (await accountModel.getAccountById(accountId)) || {
        account_id: accountId,
      };
      req.flash("notice", "Password update failed. Please try again.");
      return res.render("account/update", {
        title: "Update Account",
        nav,
        message: req.flash("notice"),
        errors: null,
        accountData,
      });
    }

    req.flash("notice", "Password updated successfully.");
    return res.redirect("/account/");
  } catch (err) {
    next(err);
  }
}

function logout(req, res, next) {
  req.session.destroy((err) => {
    if (err) {
      return next(err);
    }
    res.clearCookie("jwt");
    return res.redirect("/");
  });
}

module.exports = {
  buildLogin,
  buildRegister,
  registerAccount,
  accountLogin,
  buildAccountManagementView,
  buildUpdateAccount,
  updateAccountInfo,
  updateAccountPassword,
  logout,
};
