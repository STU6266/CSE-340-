const utilities = require("../utilities/")
const baseController = {}

baseController.buildHome = async function(req, res){
  const nav = await utilities.getNav()
  res.render("index", {title: "Home", nav})
}

async function triggerError(req, res, next) {
  throw new Error("Intentional test error");
}

baseController.triggerError = triggerError;

module.exports = baseController