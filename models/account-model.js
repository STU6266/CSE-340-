// models/account-model.js
const pool = require("../database/")

/* *****************************
*   Register new account
* *************************** */
async function registerAccount(account_firstname, account_lastname, account_email, account_password){
  const sql = "INSERT INTO account (account_firstname, account_lastname, account_email, account_password, account_type) VALUES ($1, $2, $3, $4, 'Client') RETURNING *"
  return pool.query(sql, [account_firstname, account_lastname, account_email, account_password])
}

/* **********************
 *   Check for existing email
 * ********************* */
async function checkExistingEmail(account_email){
  try {
    const sql = "SELECT * FROM account WHERE account_email = $1"
    const email = await pool.query(sql, [account_email])
    return email.rowCount
  } catch (error) {
    return error.message
  }
}

/* *****************************
 *  Return account data using account_id
 * ***************************** */
async function getAccountById(account_id) {
  try {
    const result = await pool.query(
      `SELECT account_id,
              account_firstname,
              account_lastname,
              account_email,
              account_type
       FROM account
       WHERE account_id = $1`,
      [account_id]
    )
    return result.rows[0]
  } catch (error) {
    throw error
  }
}

/* *****************************
 *  Return account data using email
 * ***************************** */
async function getAccountByEmail(account_email) {
  try {
    const result = await pool.query(
      "SELECT * FROM account WHERE account_email = $1",
      [account_email]
    )
    return result.rows[0]
  } catch (error) {
    throw error
  }
}

/* *****************************
 *  Update basic account information
 * ***************************** */
async function updateAccount(
  account_firstname,
  account_lastname,
  account_email,
  account_id
) {
  try {
    const sql = `
      UPDATE public.account
      SET
        account_firstname = $1,
        account_lastname = $2,
        account_email = $3
      WHERE account_id = $4
      RETURNING account_id
    `
    const data = await pool.query(sql, [
      account_firstname,
      account_lastname,
      account_email,
      account_id,
    ])

    return data.rowCount
  } catch (error) {
    throw error
  }
}

/* *****************************
 *  Update account password
 * ***************************** */
async function updatePassword(account_password, account_id) {
  try {
    const sql = `
      UPDATE account
      SET account_password = $1
      WHERE account_id = $2
      RETURNING *
    `
    return await pool.query(sql, [account_password, account_id])
  } catch (error) {
    throw error
  }
}


module.exports = { registerAccount, checkExistingEmail,getAccountById,getAccountByEmail,updateAccount,updatePassword,}
