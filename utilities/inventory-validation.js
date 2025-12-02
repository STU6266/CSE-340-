const { body, validationResult } = require("express-validator")
const utilities = require(".")
const invModel = require("../models/inventory-model")

const invValidate = {}

/* ***************************
 *  Classification validation rules
 * ************************** */
invValidate.classificationRules = () => {
  return [
    body("classification_name")
      .trim()
      .notEmpty()
      .withMessage("Please provide a classification name.")
      .matches(/^[A-Za-z0-9]+$/)
      .withMessage("The classification name may not contain spaces or special charackters.")
  ]
}

/* ***************************
 *  Check classification data
 * ************************** */
invValidate.checkClassificationData = async (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    return res.render("inventory/add-classification", {
      title: "Ad New Classification",
      nav,
      errors: errors.array(),
    })
  }
  next()
}

/* ***************************
 *  Inventory validation rules
 * ************************** */
invValidate.inventoryRules = () => {
  return [
    body("classification_id")
      .trim()
      .notEmpty()
      .withMessage("Please choose a classification."),

    body("inv_make")
      .trim()
      .notEmpty()
      .withMessage("Please provide the vehicle make."),

    body("inv_model")
      .trim()
      .notEmpty()
      .withMessage("Please provide the vehicle model."),

    body("inv_description")
      .trim()
      .notEmpty()
      .withMessage("Please provide a description."),

    body("inv_year")
      .trim()
      .notEmpty()
      .withMessage("Plese provide the vehicle year.")
      .isInt()
      .withMessage("Year must be a number."),

    body("inv_price")
      .trim()
      .notEmpty()
      .withMessage("Please provide the vehicle price.")
      .isFloat()
      .withMessage("Price must be a number."),

    body("inv_miles")
      .trim()
      .notEmpty()
      .withMessage("Please provide the vehicle miles.")
      .isInt()
      .withMessage("Miles must be a whole number."),

    body("inv_color")
      .trim()
      .notEmpty()
      .withMessage("Please provide the vehicle color."),

    body("inv_image")
      .trim()
      .notEmpty()
      .withMessage("Please provide an image path."),

    body("inv_thumbnail")
      .trim()
      .notEmpty()
      .withMessage("Please provide a thumbnail path."),
  ]
}

/* ***************************
 *  Check inventory data
 * ************************** */
invValidate.checkInventoryData = async (req, res, next) => {
  const errors = validationResult(req)

  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    const classificationList = await utilities.buildClassificationList(
      req.body.classification_id
    )

    return res.render("inventory/add-inventory", {
      title: "Add New Vehicle",
      nav,
      classificationList,
      errors: errors.array(),
      classification_id: req.body.classification_id,
      inv_make: req.body.inv_make,
      inv_model: req.body.inv_model,
      inv_description: req.body.inv_description,
      inv_year: req.body.inv_year,
      inv_price: req.body.inv_price,
      inv_miles: req.body.inv_miles,
      inv_color: req.body.inv_color,
      inv_image: req.body.inv_image,
      inv_thumbnail: req.body.inv_thumbnail,
    })
  }

  next()
}

/* ******************************
 * Check data and return to edit inventory view
 ***************************** */
invValidate.checkUpdateData = async (req, res, next) => {
  const {
    inv_id,
    classification_id,
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
  } = req.body

  let errors = validationResult(req)
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    const classificationList = await utilities.buildClassificationList(classification_id)
    const itemName = `${inv_make} ${inv_model}`
    return res.status(400).render("inventory/edit-inventory", {
      title: "Edit " + itemName,
      nav,
      classificationList,
      errors: errors.array(),   
      inv_id,
      classification_id,
      inv_make,
      inv_model,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_year,
      inv_miles,
      inv_color,
    })
  }
  next()
}

/* ******************************
 * Check inquiry form data and re-render form on error
 ***************************** */
invValidate.checkInquiryData = async (req, res, next) => {
  const errors = validationResult(req)
  const {
    inv_id,
    inquiry_name,
    inquiry_email,
    inquiry_phone,
    inquiry_message,
  } = req.body

  let nav = await utilities.getNav()
  const itemData = await invModel.getInventoryById(inv_id)

  if (!itemData) {
    req.flash("notice", "Sorry, that vehicle was not found.")
    return res.redirect("/inv/")
  }

  if (!errors.isEmpty()) {
    const title = `Request information about ${itemData.inv_year} ${itemData.inv_make} ${itemData.inv_model}`

    return res.render("inventory/inquiry", {
      title,
      nav,
      errors: errors.array(),
      item: itemData,
      inquiry_name,
      inquiry_email,
      inquiry_phone,
      inquiry_message,
    })
  }

  next()
}

/* ******************************
 * Validation rules for Vehicle inquiry
 ***************************** */
invValidate.inquiryRules = () => {
  return [
    body("inv_id")
      .trim()
      .isInt({ min: 1 })
      .withMessage("A valid vehicle id is required."),

    body("inquiry_name")
      .trim()
      .notEmpty()
      .withMessage("Please provide your name."),

    body("inquiry_email")
      .trim()
      .isEmail()
      .withMessage("A valid email address is required."),

    body("inquiry_phone")
      .optional({ checkFalsy: true })
      .isLength({ max: 20 })
      .withMessage("Phone number must be 20 characters or less."),

    body("inquiry_message")
      .trim()
      .notEmpty()
      .withMessage("Please enter a message."),
  ]
}


module.exports = invValidate
