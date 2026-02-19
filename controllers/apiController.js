// API Controller: JSON endpoints for inventory
// Purpose: provide paginated JSON responses for client-side UI and automated tests
// Endpoints follow /inv/api/* pattern and return data or error messages

const invModel = require("../models/inventory-model");

async function listInventoryJSON(req, res, next) {
  try {
    const page = Math.max(1, Number(req.query.page)) || 1;
    const limit = Math.min(100, Number(req.query.limit)) || 20;
    const offset = (page - 1) * limit;    
    const search = req.query.search || '';

    let items, total;
    if (search) {  
      items = await invModel.searchInventory(search, limit, offset);
      total = items.length; // For search, total is the count of returned items
    } else {
      items = await invModel.getInventoryPage(limit, offset);
      total = await invModel.countInventory();
    }  
    res.json({
      page,
      limit,
      total,
      items,
    });
  } catch (err) {
    next(err);
  }     
}

module.exports = {
  listInventoryJSON,
};