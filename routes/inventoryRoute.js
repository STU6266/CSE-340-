
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")
const utilities = require("../utilities/")
const invValidate = require("../utilities/inventory-validation")

router.get("/",utilities.checkAccountType,utilities.handleErrors(invController.buildManagementView))

router.get("/add-classification",utilities.checkAccountType,utilities.handleErrors(invController.buildAddClassification))

router.post("/add-classification",utilities.checkAccountType,invValidate.classificationRules(),
  invValidate.checkClassificationData,utilities.handleErrors(invController.processAddClassification))

router.get("/add-inventory",utilities.checkAccountType,utilities.handleErrors(invController.buildAddInventory))

router.post("/add-inventory",utilities.checkAccountType,invValidate.inventoryRules(),
  invValidate.checkInventoryData,utilities.handleErrors(invController.processAddInventory))

router.get("/type/:classificationId",utilities.handleErrors(invController.buildByClassificationId))

router.get("/detail/:inventoryId",utilities.handleErrors(invController.buildByInventoryId))

router.get("/getInventory/:classification_id",utilities.checkAccountType,utilities.handleErrors(invController.getInventoryJSON))

router.get("/edit/:inv_id",utilities.checkAccountType,utilities.handleErrors(invController.editInventoryView))

router.post("/update",utilities.checkAccountType,invValidate.inventoryRules(),
  invValidate.checkUpdateData,utilities.handleErrors(invController.updateInventory))

router.get("/delete/:inv_id",utilities.checkAccountType,utilities.handleErrors(invController.buildDeleteConfirm))

router.post("/delete",utilities.checkAccountType,utilities.handleErrors(invController.deleteInventoryItem))

router.get("/getInventory/:classification_id", utilities.handleErrors(invController.getInventoryJSON))

router.get("/edit/:inv_id", utilities.handleErrors(invController.editInventoryView))

router.post("/update", invValidate.inventoryRules(),
  invValidate.checkUpdateData,
  utilities.handleErrors(invController.updateInventory))

router.get("/delete/:inv_id", utilities.handleErrors(invController.buildDeleteConfirm))

router.post("/delete", utilities.handleErrors(invController.deleteInventoryItem))

module.exports = router;