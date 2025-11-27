
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
*  Process login
* *************************************** */
accountController.accountLogin = async function (req, res, next) {
  const nav = await utilities.getNav()
  const { account_email, account_password } = req.body
  
  try {
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

    const passwordMatch = await bcrypt.compare(
      account_password,
      accountData.account_password
    )
    
    if (!passwordMatch) {
      req.flash("notice", "Plese check your credentials and try again.")
      return res.status(400).render("account/login", {
        title: "Login",
        nav,
        errors: null,
        account_email,
      })
    }

    delete accountData.account_password

    const accessToken = jwt.sign(
      accountData,
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: 3600 }
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
  } catch (err) {
    return next(err)
  }
}

/* ****************************************
*  Deliver account management view
* *************************************** */
accountController.buildAccountManagement = async function (req, res, next) {
  const nav = await utilities.getNav()
  res.render("account/management", {
    title: "Account Management",
    nav,
    errors: null,
  })
}

/* ***************************
 *  Deliver account update view
 * ************************** */
accountController.buildUpdateAccount = async function (req, res, next) {
  const account_id = parseInt(req.params.account_id)
  const nav = await utilities.getNav()

  const accountData = await accountModel.getAccountById(account_id)

  if (!accountData) {
    req.flash("notice", "Account not found.")
    return res.redirect("/account/")
  }

  return res.render("account/update", {
    title: "Update Account",
    nav,
    errors: null,
    account_id: accountData.account_id,
    account_firstname: accountData.account_firstname,
    account_lastname: accountData.account_lastname,
    account_email: accountData.account_email,
  })
}

/* ****************************************
*  Process account information update
* *************************************** */
accountController.updateAccount = async function (req, res, next) {
  const nav = await utilities.getNav()
  const { account_firstname, account_lastname, account_email, account_id } =
    req.body
  
  
  try {
    const updateResult = await accountModel.updateAccount(
      account_firstname,
      account_lastname,
      account_email,
      account_id
    )
    
    if (updateResult) {
      req.flash("notice", "Account information updated successfully.")
      return res.redirect("/account/")
    } else {
      req.flash("notice", "Sorry, the update failed.")
      return res.status(500).render("account/update", {
        title: "Update Account",
        nav,
        errors: null,
        account_id,
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
*  Process password update
* *************************************** */
accountController.updatePassword = async function (req, res, next) {
  const nav = await utilities.getNav()
  const { account_password, account_id } = req.body
  
  try {
    const hashedPassword = await bcrypt.hash(account_password, 10)

    const updateResult = await accountModel.updatePassword(
      hashedPassword,
      account_id
    )
    
    if (updateResult) {
      req.flash("notice", "Password updated successfully.")
      return res.redirect("/account/")
    } else {
      req.flash("notice", "Sorry, the password update failed.")
      const accountData = await accountModel.getAccountById(account_id)

      return res.status(500).render("account/update", {
        title: "Update Account",
        nav,
        errors: null,
        account_id: accountData.account_id,
        account_firstname: accountData.account_firstname,
        account_lastname: accountData.account_lastname,
        account_email: accountData.account_email,
      })
    }
  } catch (err) {
    return next(err)
  }
}

/* ****************************************
*  Logout
* *************************************** */
accountController.logoutAccount = async function (req, res, next) {
  try {
    res.clearCookie("jwt")

    req.flash("notice", "You have been logged out.")

    return res.redirect("/")
  } catch (err) {
    return next(err)
  }
}

module.exports = accountController

