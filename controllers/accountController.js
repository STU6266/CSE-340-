
const utilities = require("../utilities/")
const accountModel = require("../models/account-model")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
require("dotenv").config()

const accountController = {}


/* ****************************************
*  Deliver login view
* *************************************** */
accountController.buildLogin = async function (req, res, next) {
  const nav = await utilities.getNav()
  res.render("account/login", {
    title: "Login",
    nav,
    errors: null,
  })
}

/* ****************************************
*  Deliver registration view
* *************************************** */
accountController.buildRegister = async function (req, res, next) {
  const nav = await utilities.getNav()
  res.render("account/register", {
    title: "Register",
    nav,
    errors: null,
  })
}

/* ****************************************
 *  Deliver account management view
 * ************************************ */
accountController.buildAccountManagement = async function (req, res, next) {
  let nav = await utilities.getNav()
  res.render("account/account", {
    title: "Account Management",
    nav,
    errors: null,
    
  })
}

/* ****************************************
*  Process Registration
* *************************************** */
accountController.registerAccount = async function (req, res, next) {
  const nav = await utilities.getNav()
  const { account_firstname, account_lastname, account_email, account_password } = req.body

  let hashedPassword
  try {
    hashedPassword = await bcrypt.hashSync(account_password, 10)
  } catch (error) {
    req.flash("notice", 'Sorry, there was an error processing the registration.')
    return res.status(500).render("account/register", {
      title: "Register",
      nav,
      errors: null,
    })
  }

  try {
    const regResult = await accountModel.registerAccount(
      account_firstname,
      account_lastname,
      account_email,
      hashedPassword
    )

    if (regResult) {
      req.flash("notice", `Congratulations, you're registered ${account_firstname}. Please log in.`)
      return res.status(201).render("account/login", { title: "Login", nav, errors: null })
    } else {
      req.flash("notice", "Sorry, the registration failed.")
      return res.status(501).render("account/register", {
        title: "Register",
        nav,
        errors: null,
        account_firstname,
        account_lastname,
        account_email,
      })
    }
  } catch (err) {
    return next(err)
  }
}

/* ****************************************
 *  Process login request
 * ************************************ */
accountController.accountLogin = async function (req, res) {
  let nav = await utilities.getNav()
  const { account_email, account_password } = req.body
  const accountData = await accountModel.getAccountByEmail(account_email)
  if (!accountData) {
    req.flash("notice", "Please check your credentials and try again.")
    return res.status(400).render("account/login", {
      title: "Login",
      nav,
      errors: null,
      account_email,
    })
  }
  try {
    if (await bcrypt.compare(account_password, accountData.account_password)) {
      delete accountData.account_password
      const accessToken = jwt.sign(
        accountData,
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: 3600 * 1000 }
      )
      if (process.env.NODE_ENV === "development") {
        res.cookie("jwt", accessToken, {
          httpOnly: true,
          maxAge: 3600 * 1000,
        })
      } else {
        res.cookie("jwt", accessToken, {
          httpOnly: true,
          secure: true,
          maxAge: 3600 * 1000,
        })
      }
      return res.redirect("/account/")
    } else {
      req.flash(
        "message notice",
        "Please check your credentials and try again."
      )
      return res.status(400).render("account/login", {
        title: "Login",
        nav,
        errors: null,
        account_email,
      })
    }
  } catch (error) {
    throw new Error("Access Forbidden")
  }
}

module.exports = accountController
