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
  const inventoryId = Number(req.params.inventoryId);
  const item = await invModel.getInventoryById(inventoryId);

  const nav = await utilities.getNav();

  if (!item) {
    res.status(404);
    return res.render("inventory/detail", {
      title: "Vehicle not found",
      nav,
      item: null,
      detail: "",
      message: "Sorry, we couldn't find that vehicle.",
    });
  }

  const title = `${item.inv_make} ${item.inv_model}`;
  const detail = utilities.buildVehicleDetail(item);
  return res.render("inventory/detail", {
    title,
    nav,
    item,
    detail,
    message: null,
  });
}

invCont.buildByInventoryId = buildByInventoryId
module.exports = invCont