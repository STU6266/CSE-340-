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

invCont.buildByInventoryId = buildByInventoryId
module.exports = invCont