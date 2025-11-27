
const express = require("express")
const router = new express.Router()
const utilities = require("../utilities/")
const accountController = require("../controllers/accountController")
const regValidate = require("../utilities/account-validation")
const bcrypt = require("bcryptjs")


router.get("/login", utilities.handleErrors(accountController.buildLogin))
router.get("/register", utilities.handleErrors(accountController.buildRegister))

router.post("/register", regValidate.registationRules(),
  regValidate.checkRegData,
  utilities.handleErrors(accountController.registerAccount))

router.post("/login",regValidate.loginRules(),
  regValidate.checkLoginData,utilities.handleErrors(accountController.accountLogin))

router.get("/", utilities.checkLogin,utilities.handleErrors(accountController.buildAccountManagement))

router.get("/update/:account_id",utilities.checkLogin,utilities.handleErrors(accountController.buildUpdateAccount))

router.post("/update",utilities.checkLogin,regValidate.updateAccountRules(),
  regValidate.checkUpdateAccountData,utilities.handleErrors(accountController.updateAccount))

router.post("/update-password", utilities.checkLogin,regValidate.updatePasswordRules(),
  regValidate.checkUpdatePasswordData,utilities.handleErrors(accountController.updatePassword))

router.get("/logout",utilities.checkLogin,utilities.handleErrors(accountController.logoutAccount))
router.post("/login", regValidate.loginRules(),
  regValidate.checkLoginData,
  utilities.handleErrors(accountController.accountLogin))

module.exports = router
