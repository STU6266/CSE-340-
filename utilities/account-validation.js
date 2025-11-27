// utilities/account-validation.js
const utilities = require(".")
const { body, validationResult } = require("express-validator")
const accountModel = require("../models/account-model")

const validate = {}

/*  **********************************
 *  Registration Data Validation Rules
 *  ********************************* */
validate.registationRules = () => {
  return [
 
    body("account_firstname")
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 1 })
      .withMessage("Please provide a first name."),

    body("account_lastname")
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 2 })
      .withMessage("Please provide a last name."),

    body("account_email")
      .trim()
      .isEmail()
      .normalizeEmail()
      .withMessage("A valid email is required.")
      .custom(async (account_email) => {
        const emailExists = await accountModel.checkExistingEmail(account_email)
        if (emailExists) {
          throw new Error("Email exists. Please log in or use different email")
        }
      }),

    body("account_password")
      .trim()
      .notEmpty()
      .isStrongPassword({
        minLength: 12,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1,
      })
      .withMessage("Password does not meet requirements."),
  ]
}

/* ******************************
 * Check data and return errors or continue to registration
 * ***************************** */
validate.checkRegData = async (req, res, next) => {
  const { account_firstname, account_lastname, account_email } = req.body
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    const nav = await utilities.getNav()
    return res.render("account/register", {
      title: "Register",
      nav,
      errors,
      account_firstname,
      account_lastname,
      account_email,
    })
  }
  next()
}

/*  **********************************
 *  Login Data Validation Rules
 *  ********************************* */
validate.loginRules = () => {
  return [
    body("account_email")
      .trim()
      .isEmail()
      .normalizeEmail()
      .withMessage("A valid email is required."),
    body("account_password")
      .trim()
      .notEmpty()
      .withMessage("Password is required."),
  ]
}

/*  **********************************
 *  Account Update Data Validation Rules
 *  ********************************* */
validate.updateAccountRules = () => {
  return [
    body("account_firstname")
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 1 })
      .withMessage("Please provide a first name."),

    body("account_lastname")
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 2 })
      .withMessage("Please provide a last name."),

    body("account_email")
      .trim()
      .isEmail()
      .normalizeEmail()
      .withMessage("A valid email is required.")
      .custom(async (account_email, { req }) => {
        const account_id = req.body.account_id
        const currentAccount = await accountModel.getAccountById(account_id)

        if (currentAccount && currentAccount.account_email === account_email) {
          return true
        }

        const emailExists = await accountModel.checkExistingEmail(account_email)
        if (emailExists) {
          throw new Error(
            "Email exists. Please use a different email address."
          )
        }

        return true
      }),
  ]
}

/* ******************************
 * Check account update data and return errors or continue
 * ***************************** */
validate.checkUpdateAccountData = async (req, res, next) => {
  const errors = validationResult(req)
  const { account_firstname, account_lastname, account_email, account_id } =
    req.body

  if (!errors.isEmpty()) {
    const nav = await utilities.getNav()

    return res.render("account/update", {
      title: "Update Account",
      nav,
      errors,
      account_id,
      account_firstname,
      account_lastname,
      account_email,
    })
  }

  next()
}

/*  **********************************
 *  Password Update Validation Rules
 *  ********************************* */
validate.updatePasswordRules = () => {
  return [
    body("account_password")
      .trim()
      .notEmpty()
      .isStrongPassword({
        minLength: 12,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1,
      })
      .withMessage("Password dos not meet requirements."),
  ]
}

/* ******************************
 * Check password update data and return errors or continue
 * ***************************** */
validate.checkUpdatePasswordData = async (req, res, next) => {
 
  const errors = validationResult(req)
  const { account_id } = req.body

  if (!errors.isEmpty()) {
    const nav = await utilities.getNav()
    const accountData = await accountModel.getAccountById(account_id)

    return res.render("account/update", {
      title: "Update Account",
      nav,
      errors,
      account_id: accountData.account_id,
      account_firstname: accountData.account_firstname,
      account_lastname: accountData.account_lastname,
      account_email: accountData.account_email,
    })
  }

  next()
}

/* ******************************
 * Check login data and return errors or continue
 * ***************************** */
validate.checkLoginData = async (req, res, next) => {
  const { account_email } = req.body
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    const nav = await utilities.getNav()
    return res.render("account/login", {
      title: "Login",
      nav,
      errors,
      account_email,
      message: null,
    })
  }
  next()
}

module.exports = validate
