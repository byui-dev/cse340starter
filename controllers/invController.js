const invModel = require("../models/inventory-model");
const utilities = require("../utilities/");

const invCont = {};

/********************************
 * Build inventory management view
 * ******************************/
invCont.buildManagement = async function (req, res, next) {
  try {
    let nav = await utilities.getNav();
    const classificationSelect = await utilities.buildClassificationList();
    res.render("inventory/management", {
      title: "Inventory Management",
      nav,
      classificationSelect,
      message: req.flash("notice"),
      errors: null,
    });
  } catch (err) {
    next(err);
  }
};

/********************************
 * Build add classification view
 * ******************************/
invCont.buildAddClassification = async function (req, res, next) {
  try {
    let nav = await utilities.getNav();
    res.render("inventory/add-classification", {
      title: "Add Classification",
      nav,
      message: req.flash("notice"),
      errors: null,
    });
  } catch (err) {
    next(err);
  }
};

/********************************
 * Build add inventory view
 * ******************************/
invCont.buildAddInventory = async function (req, res, next) {
  try {
    let nav = await utilities.getNav();
    const classificationList = await utilities.buildClassificationList();

    res.render("inventory/add-inventory", {
      title: "Add Inventory",
      nav,
      classificationList,
      message: req.flash("notice"),
      errors: null,
      inv_make: "",
      inv_model: "",
      inv_year: "",
      inv_description: "",
      inv_image: "/images/vehicles/no-image.png",
      inv_thumbnail: "/images/vehicles/no-image-tn.png",
      inv_price: "",
      inv_miles: "",
      inv_color: "",
      classification_id: null,
    });
  } catch (err) {
    next(err);
  }
};

/********************************
 * Process add classification
 * ******************************/
invCont.addClassification = async function (req, res, next) {
  try {
    const { classification_name } = req.body;
    const addResult = await invModel.addClassification(classification_name);
    if (addResult) {
      req.flash("notice", `Classification "${classification_name}" added.`);
      return res.redirect("/inv/");
    }
    req.flash("notice", "Sorry, the classification could not be added.");
    return res.redirect("/inv/add-class");
  } catch (err) {
    next(err);
  }
};

/********************************
 * Process add inventory
 * ******************************/
invCont.addInventory = async function (req, res, next) {
  try {
    const {
      inv_make,
      inv_model,
      inv_year,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_miles,
      inv_color,
      classification_id,
    } = req.body;

    const addResult = await invModel.addInventory(
      inv_make,
      inv_model,
      inv_year,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_miles,
      inv_color,
      classification_id,
    );

    if (addResult) {
      req.flash("notice", "Inventory item added.");
      return res.redirect("/inv/");
    }

    const classificationList =
      await utilities.buildClassificationList(classification_id);
    req.flash("notice", "Sorry, the inventory item could not be added.");
    return res.status(501).render("inventory/add-inventory", {
      title: "Add Inventory",
      nav: await utilities.getNav(),
      classificationList,
      message: req.flash("notice"),
      errors: [{ msg: "Database insert failed." }],
      inv_make,
      inv_model,
      inv_year,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_miles,
      inv_color,
      classification_id,
    });
  } catch (err) {
    next(err);
  }
};

/********************************
 * Build inventory by classificationId view
 * ******************************/
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId;
  const data = await invModel.getInventoryByClassificationId(classification_id);
  const grid = await utilities.buildClassificationGrid(data);
  let nav = await utilities.getNav();
  const className = data[0].classification_name;
  res.render("inventory/classification", {
    title: className + " Vehicles",
    nav,
    grid,
  });
};

/********************************
 * Build vehicle detail view
 * ******************************/
invCont.buildByInventoryId = async function (req, res, next) {
  const inventory_id = req.params.inventoryId;
  const vehicle = await invModel.getVehicleById(inventory_id);
  const detail = await utilities.buildVehicleDetail(vehicle);
  let nav = await utilities.getNav();
  res.render("inventory/items", {
    title: `${vehicle.inv_make} ${vehicle.inv_model}`,
    nav,
    detail,
  });
};

/*************************************
 * Return inventory by Classification As JSON
 * ************************************/
invCont.getInventoryJSON = async (req, res, next) => {
  const classification_id = parseInt(req.params.classification_id);
  const invData =
    await invModel.getInventoryByClassificationId(classification_id);
  if (invData[0].inv_id) {
    return res.json(invData);
  } else {
    next(new Error("No data returned"));
  }
};

module.exports = invCont;
