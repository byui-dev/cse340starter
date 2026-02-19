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
    const inventoryList = await invModel.getAllInventory();
    res.render("inventory/management", {
      title: "Inventory Management",
      nav,
      classificationSelect,
      inventoryList,
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

/********************************
 * Build edit inventory view
 * ******************************/
invCont.buildEditInventory = async function (req, res, next) {
  try {
    const inventory_id = parseInt(req.params.inventoryId);
    let nav = await utilities.getNav();
    const itemData = await invModel.getVehicleById(inventory_id);
    const classificationList = await utilities.buildClassificationList(
      itemData.classification_id,
    );
    const itemName = `${itemData.inv_make} ${itemData.inv_model}`;
    res.render("inventory/edit-inventory", {
      title: `Edit ${itemName}`,
      nav,
      classificationList,
      message: req.flash("notice"),
      errors: null,
      inventory_id: itemData.inv_id,
      inv_make: itemData.inv_make,
      inv_model: itemData.inv_model,
      inv_year: itemData.inv_year,
      inv_description: itemData.inv_description,
      inv_image: itemData.inv_image,
      inv_thumbnail: itemData.inv_thumbnail,
      inv_price: itemData.inv_price,
      inv_miles: itemData.inv_miles,
      inv_color: itemData.inv_color,
      classification_id: itemData.classification_id,
    });
  } catch (err) {
    next(err);
  }
};

/* ***************************
 *  Update Inventory Data
 * ************************** */
invCont.updateInventory = async function (req, res, next) {
  let nav = await utilities.getNav()
  const {
    inv_id,
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
    classification_id,
  } = req.body
  const updateResult = await invModel.updateInventory(
    inv_id,  
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
    classification_id
  )

  if (updateResult) {
    const itemName = updateResult.inv_make + " " + updateResult.inv_model
    req.flash("notice", `The ${itemName} was successfully updated.`)
    res.redirect("/inv/")
  } else {
    const classificationSelect = await utilities.buildClassificationList(classification_id)
    const itemName = `${inv_make} ${inv_model}`
    req.flash("notice", "Sorry, the insert failed.")
    res.status(501).render("inventory/edit-inventory", {
    title: "Edit " + itemName,
    nav,
    classificationSelect: classificationSelect,
    errors: null,
    inv_id,
    inv_make,
    inv_model,
    inv_year,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_miles,
    inv_color,
    classification_id
    })
  }
}

/********************************
 * Process inventory update
 * ******************************/
invCont.updateInventory = async function (req, res, next) {
  try {
    const {
      inventory_id,
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

    const updateResult = await invModel.updateInventory(
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
      inventory_id,
    );

    if (updateResult) {
      req.flash("notice", "Inventory item updated.");
      return res.redirect("/inv/");
    }

    const classificationList =
      await utilities.buildClassificationList(classification_id);
    req.flash("notice", "Sorry, the inventory item could not be updated.");
    return res.status(500).render("inventory/edit-inventory", {
      title: "Edit Inventory",
      nav: await utilities.getNav(),
      classificationList,
      message: req.flash("notice"),
      errors: [{ msg: "Database update failed." }],
      inventory_id,
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
 * Build delete inventory view
 * ******************************/
invCont.buildDeleteInventory = async function (req, res, next) {
  try {
    const inventory_id = parseInt(req.params.inventoryId);
    const nav = await utilities.getNav();
    const itemData = await invModel.getVehicleById(inventory_id);
    const itemName = `${itemData.inv_make} ${itemData.inv_model}`;

    res.render("inventory/delete-inventory", {
      title: `Delete ${itemName}`,
      nav,
      message: req.flash("notice"),
      errors: null,
      inventory_id: itemData.inv_id,
      inv_make: itemData.inv_make,
      inv_model: itemData.inv_model,
      inv_year: itemData.inv_year,
      inv_price: itemData.inv_price,
    });
  } catch (err) {
    next(err);
  }
};

/********************************
 * Process inventory delete
 * ******************************/
invCont.deleteInventory = async function (req, res, next) {
  try {
    const { inventory_id } = req.body;
    const deleteResult = await invModel.deleteInventory(inventory_id);
    if (deleteResult) {
      req.flash("notice", "Inventory item deleted.");
      return res.redirect("/inv/");
    }

    req.flash("notice", "Sorry, the inventory item could not be deleted.");
    return res.redirect(`/inv/delete/${inventory_id}`);
  } catch (err) {
    next(err);
  }
};

/*****************************************************
 * Management view with pagination support
 * Purpose: Read query params and use model pagination APIs
 * Passes `page`, `limit`, and `total` to the view for pagination partial
 * ********************************************************/
async function buildManagement(req, res, next) {
  try {
    const page = Math.max(1, Number(req.query.page) || 1);
    const limit = Math.min(50, Number(req.query.limit) || 10);
    const offet = (page - 1) * limit;
    const inventory = await invModel.getInventoryPage(limit, offset);
    const total = await invModel.countInventory();

    let nav = await utilities.getNav();
    res.render('inventory/management', {
      title: 'Inventory Management',
      nav,
      inventory,
      page,
      limit,
      total,
      message: req.flash('noticee'),
      errors: null,
    });
  } catch (err) {
    next(err);
  }
}  

module.exports = invCont;
