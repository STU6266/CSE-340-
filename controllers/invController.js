const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invCont = {}

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId
  const data = await invModel.getInventoryByClassificationId(classification_id)
  const grid = await utilities.buildClassificationGrid(data)
  let nav = await utilities.getNav()
  const className = data?.[0]?.classification_name || "Vehicles"
  res.render("inventory/classification", {
    title: className + " vehicles",
    nav,
    grid,
  })
}

async function buildByInventoryId(req, res, next) {
  const inventoryId = Number(req.params.inventoryId)
  const item = await invModel.getInventoryById(inventoryId)
  if (!item) return next(new Error("Not found"))

  const nav = await utilities.getNav()
  const title = `${item.inv_make} ${item.inv_model}`
  const detail = utilities.buildVehicleDetail(item)

  return res.render("inventory/detail", { title, nav, detail })
}

/* ***************************
 *  Build inventory management view
 * ************************** */
invCont.buildManagementView = async function (req, res, next) {
  let nav = await utilities.getNav()
  res.render("inventory/management", {
    title: "Inventory Management",
    nav,
  })
}

/* ***************************
 *  Build add classification view
 * ************************** */
invCont.buildAddClassification = async function (req, res, next) {
  let nav = await utilities.getNav()
  res.render("inventory/add-classification", {
    title: "Add New Classification",
    nav,
    errors: null,
  })
}

/* ***************************
 *  Process add classification
 * ************************** */
invCont.processAddClassification = async function (req, res, next) {
  const { classification_name } = req.body

  const result = await invModel.addClassification(classification_name)

  if (result && result.rowCount > 0) {
    req.flash("notice", "Classification added successfully.")
    let nav = await utilities.getNav()
    return res.render("inventory/management", {
      title: "Inventory Management",
      nav,
    })
  } else {
    req.flash("notice", "Sorry the classification could not be added.")
    let nav = await utilities.getNav()
    return res.render("inventory/add-classification", {
      title: "Add New Classification",
      nav,
      errors: null,
    })
  }
}

/* ***************************
 *  Build add inventory view
 * ************************** */
invCont.buildAddInventory = async function (req, res, next) {
  let nav = await utilities.getNav()
  const classificationList = await utilities.buildClassificationList()
  res.render("inventory/add-inventory", {
    title: "Add New Vehicle",
    nav,
    classificationList,
    errors: null,
  })
}

/* ***************************
 *  Process add inventory
 * ************************** */
invCont.processAddInventory = async function (req, res, next) {
  const {
    classification_id,
    inv_make,
    inv_model,
    inv_description,
    inv_year,
    inv_price,
    inv_miles,
    inv_color,
    inv_image,
    inv_thumbnail,
  } = req.body

  const result = await invModel.addInventory(
    classification_id,
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color
  )

  if (result && result.rowCount > 0) {
    req.flash("notice", "Vehicle added successfully.")
    let nav = await utilities.getNav()
    return res.render("inventory/management", {
      title: "Inventory Management",
      nav,
    })
  } else {
    req.flash("notice", "Sorry, the vehicle could not be added.")
    let nav = await utilities.getNav()
    const classificationList = await utilities.buildClassificationList(
      classification_id
    )
    return res.render("inventory/add-inventory", {
      title: "Add New Veicle",
      nav,
      classificationList,
      errors: null,
      classification_id,
      inv_make,
      inv_model,
      inv_description,
      inv_year,
      inv_price,
      inv_miles,
      inv_color,
      inv_image,
      inv_thumbnail,
    })
  }
}

invCont.buildByInventoryId = buildByInventoryId
module.exports = invCont