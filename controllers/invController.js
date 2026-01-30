const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invCont = {}

/********************************
 * Build inventory by classificationId view
 * ******************************/
invCont.buildByClassificationId = async function (req, res, next) {
    const classification_id = req.params.classificationId 
    const data = await invModel.getInventoryByClassificationId(classification_id)
    const grid = await utilities.buildClassificationGrid(data)
    let nav = await utilities.getNav()
    const className = data[0].classification_name
    res.render("inventory/classification", {
      title: className + " Vehicles",
      nav,
      grid,
    })
}

/********************************
 * Build vehicle detail view
 * ******************************/
invCont.buildByInventoryId = async function (req, res, next) {
  const inventory_id = req.params.inventoryId 
  const vehicle = await invModel.getVehicleById(inventory_id)
  const detail = await utilities.buildVehicleDetail(vehicle)
  let nav = await utilities.getNav()
  res.render("inventory/items", { 
    title: `${vehicle.inv_make} ${vehicle.inv_model}`,
    nav,
    detail
  })
}

module.exports = invCont