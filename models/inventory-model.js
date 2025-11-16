
const pool = require("../database/")

/* ***************************
 *  Get all classification data
 * ************************** */
async function getClassifications(){
  return await pool.query("SELECT * FROM public.classification ORDER BY classification_name")
}

/* ***************************
 *  Add classification
 * ************************** */
async function addClassification(classification_name) {
  const sql = "INSERT INTO public.classification (classification_name) VALUES ($1)"
  const data = await pool.query(sql, [classification_name])
  return data
}


/* ***************************
 *  Get inventory items and classification_name
 * ************************** */
async function getInventoryByClassificationId(classification_id) {
  try {
    const data = await pool.query(
      `SELECT * FROM public.inventory AS i 
      JOIN public.classification AS c 
      ON i.classification_id = c.classification_id 
      WHERE i.classification_id = $1`,
      [classification_id]
    )
    return data.rows
  } catch (error) {
    console.error("getclassificationsbyid error " + error)
  }
}

async function getInventoryById(inv_id) {
  const sql = "SELECT * FROM inventory WHERE inv_id = $1";
  const result = await pool.query(sql, [inv_id]);
  return result.rows[0] ?? null;
}

/* ***************************
 *  Add inventory item
 * ************************** */
async function addInventory(
  classification_id,
  inv_make,
  inv_model,
  inv_description,
  inv_image,
  inv_thumbnail,
  inv_price,
  inv_year,
  inv_miles,
  inv_color
) {
  const sql = `
    INSERT INTO public.inventory
      (inv_make, inv_model, inv_description, inv_image, inv_thumbnail,
       inv_price, inv_year, inv_miles, inv_color, classification_id)
    VALUES
      ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
  `
  const data = await pool.query(sql, [
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
  ])
  return data
}

module.exports = {getClassifications, getInventoryByClassificationId, getInventoryById, addClassification, addInventory};