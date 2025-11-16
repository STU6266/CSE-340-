// Needed Resources 
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")
const utilities = require("../utilities/")
const invValidate = require("../utilities/inventory-validation")


router.get("/", utilities.handleErrors(invController.buildManagementView))

router.get("/add-classification", utilities.handleErrors(invController.buildAddClassification))

router.post("/add-classification", invValidate.classificationRules(),
  invValidate.checkClassificationData,
  utilities.handleErrors(invController.processAddClassification))

router.get("/add-inventory", utilities.handleErrors(invController.buildAddInventory))

router.post("/add-inventory", invValidate.inventoryRules(),
  invValidate.checkInventoryData,
  utilities.handleErrors(invController.processAddInventory))

router.get("/type/:classificationId", utilities.handleErrors(invController.buildByClassificationId))

router.get("/detail/:inventoryId", utilities.handleErrors(invController.buildByInventoryId));

module.exports = router;