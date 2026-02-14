const pool = require("../database/");

/********************************
 * Register new account
 * ******************************/
async function registerAccount(
  account_firstname,
  account_lastname,
  account_email,
  account_password,
) {
  try {
    const sql =
      "INSERT INTO account (account_firstname, account_lastname, account_email, account_password, account_type) VALUES ($1, $2, $3, $4, 'Client') RETURNING *";
    return await pool.query(sql, [
      account_firstname,
      account_lastname,
      account_email,
      account_password,
    ]);
  } catch (error) {
    return error.message;
  }
}

/********************************
 * Return account data by email address
 * ******************************/
async function getAccountByEmail(account_email) {
  try {
    const result = await pool.query(
      "SELECT account_id, account_firstname, account_lastname, account_email, account_password, account_type FROM account WHERE account_email = $1",
      [account_email],
    );
    return result.rows[0];
  } catch (error) {
    return new Error("No matching email found");
  }
}

/**
 * Return account data by account_id
 */
async function getAccountById(account_id) {
  try {
    const result = await pool.query(
      "SELECT account_id, account_firstname, account_lastname, account_email, account_type FROM account WHERE account_id = $1",
      [account_id],
    );
    return result.rows[0];
  } catch (error) {
    console.error("getAccountById error: " + error);
    return null;
  }
}

/********************************
 * Update an account record
 * ******************************/
async function updateAccountInfo(
  account_id,
  account_firstname,
  account_lastname,
  account_email,
) {
  try {
    const sql = `
      UPDATE account
      SET account_firstname = $1,
          account_lastname = $2,
          account_email = $3
      WHERE account_id = $4
      RETURNING account_id, account_firstname, account_lastname, account_email, account_type`;

    const result = await pool.query(sql, [
      account_firstname,
      account_lastname,
      account_email,
      account_id,
    ]);

    return result.rows[0];
  } catch (error) {
    console.error("updateAccountInfo error: " + error);
    return null;
  }
}

async function updateAccountPassword(account_id, account_password) {
  try {
    const sql =
      "UPDATE account SET account_password = $1 WHERE account_id = $2 RETURNING account_id";
    const result = await pool.query(sql, [account_password, account_id]);
    return result.rowCount > 0;
  } catch (error) {
    console.error("updateAccountPassword error: " + error);
    return null;
  }
}

module.exports = {
  registerAccount,
  getAccountByEmail,
  getAccountById,
  updateAccountInfo,
  updateAccountPassword,
};
