// Inventory model: pagination, search, add, update, soft-delete
// Purpose: provide reusable DB operations used by controllers and API
// These return rows or counts and use parameterized queries

const pool = require("../database/");

/********************************
 * Get all classification data
 * ******************************/
async function getClassifications() {
  return await pool.query(
    "SELECT * FROM public.classification ORDER BY classification_name",
  );
}

/*********************************
 * Get all inventory items and classification_name by classification_id
 * ******************************/
async function getInventoryByClassificationId(classification_id) {
  try {
    const data = await pool.query(
      `SELECT * FROM public.inventory AS i
        JOIN public.classification AS c 
        ON i.classification_id = c.classification_id
        WHERE i.classification_id = $1`,
      [classification_id],
    );
    return data.rows;
  } catch (error) {
    console.error("getclassificationbyid error: " + error);
  }
}

/**********************************
 * Get vehicle detail by inventory_id
 **********************************/
async function getVehicleById(inventory_id) {
  try {
    const data = await pool.query(
      `SELECT * FROM public.inventory AS i
        JOIN public.classification AS c 
        ON i.classification_id = c.classification_id
        WHERE i.inv_id = $1`,
      [inventory_id],
    );
    return data.rows[0]; // single vehicle
  } catch (error) {
    console.error("getVehicleById error: " + error);
  }
}

/*********************************
 * Get all inventory items
 * ******************************/
async function getAllInventory() {
  try {
    const data = await pool.query(
      `SELECT * FROM public.inventory AS i
        JOIN public.classification AS c
        ON i.classification_id = c.classification_id
        ORDER BY i.inv_make, i.inv_model`,
    );
    return data.rows;
  } catch (error) {
    console.error("getAllInventory error: " + error);
  }
}

/********************************
 * Add a new classification
 * ******************************/
async function addClassification(classification_name) {
  try {
    const sql =
      "INSERT INTO public.classification (classification_name) VALUES ($1) RETURNING *";
    return await pool.query(sql, [classification_name]);
  } catch (error) {
    console.error("addClassification error: " + error);
    return null;
  }
}

/********************************
 * Add a new inventory item
 * ******************************/
async function addInventory(
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
) {
  try {
    const sql = `INSERT INTO public.inventory (
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
        ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) RETURNING *`;
    return await pool.query(sql, [
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
    ]);
  } catch (error) {
    console.error("addInventory error: " + error);
    return null;
  }
}

/********************************
 * Update inventory item
 * ******************************/
async function updateInventory(
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
) {
  try {
    const sql = `UPDATE public.inventory SET
            inv_make = $1,
            inv_model = $2,
            inv_year = $3,
            inv_description = $4,
            inv_image = $5,
            inv_thumbnail = $6,
            inv_price = $7,
            inv_miles = $8,
            inv_color = $9,
            classification_id = $10
        WHERE inv_id = $11 RETURNING *`;
    return await pool.query(sql, [
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
    ]);
  } catch (error) {
    console.error("updateInventory error: " + error);
    return null;
  }
}

/************************************
 * Delete inventory item
 * ******************************/
async function deleteInventory(inventory_id) {
  try {
    const sql = `DELETE FROM public.inventory WHERE inv_id = $1 RETURNING *`;
    const result = await pool.query(sql, [inventory_id]);
    return result.rowCount > 0; // return true if a row was deleted
  } catch (error) {
    console.error("deleteInventory error: " + error);
    return null;
  }
}

async function getInventoryPage(limit = 20, offset = 0) {
  const sql = `SELECT * FROM inventory WHERE (is_active IS NULL is_active = true) ORDER BY inv_id DESC LIMIT $1 OFFSET $2`;
  const result = await pool.query(sql, [limit, offset]);
  return result.rows;
}

async function countInventory() {
  const sql = `SELECT COUNT(*) FROM inventory WHERE (is_active IS NULL OR is_active = true)`;
  const result = await pool.query(sql);
  return Number(result.rows[0].count);
}

async function searchInventory(term, limit = 20, offset = 0) {
  const q = `%${term}%`;
   const sql = `SELECT * FROM inventory WHERE (is_active IS NULL OR is_active = true) AND (inv_make ILIKE $1 OR inv_model ILIKE $1 OR inv_description ILIKE $1) ORDER BY inv_id DESC LIMIT $2 OFFSET $3`;
  const result = await pool.query(sql, [q, limit, offset]);
  return result.rows;
}

async function createInventory(data) {
  const sql = `INSERT INTO inventory (inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id, is_active) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11) RETURNING *`;
  const params = [
    data.inv_make,
    data.inv_model,
    data.inv_year,
    data.inv_description,
    data.inv_image,
    data.inv_thumbnail,
    data.inv_price,
    data.inv_miles,
    data.inv_color,
    data.classification_id,
  ];
  const result = await pool.query(sql, params);
  return result.rows[0];
}

async function updateInventory(invId, data) {
  const sql = `UPDATE inventory SET inv_make = $1, inv_model = $2, inv_year = $3, inv_description = $4, inv_image = $5, inv_thumbnail = $6, inv_price = $7, inv_miles = $8, inv_color = $9, classification_id = $10 WHERE inv_id = $11 RETURNING *`;
  const params = [
    data.inv_make,
    data.inv_model,
    data.inv_year,
    data.inv_description,
    data.inv_image,
    data.inv_thumbnail,
    data.inv_price,
    data.inv_miles,
    data.inv_color,
    data.classification_id,
    invId
  ];
  const result = await pool.query(sql, params);
  return result.rows[0];
}

async function archiveInventory(invId) {
  const sql = `UPDATE inventory SET is_active = false WHERE inv_id = $1 RETURNING *`;
  const result = await pool.query(sql, [invId]);
  return result.rowCount > 0; // return true if a row was updated
}



module.exports = {
  getClassifications,
  getAllInventory,
  getInventoryByClassificationId,
  getVehicleById,
  addClassification,
  addInventory,
  updateInventory,
  deleteInventory,
  getInventoryPage,
  countInventory,
  searchInventory,
  createInventory,
  updateInventory,
  archiveInventory,
};
