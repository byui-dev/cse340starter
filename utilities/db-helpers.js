// Utilitites: DB helper functions
// Purpose: centralize query and transaction logic to ensure consistent parameterized queries and error handling    
// Used by models for safe queries and atomic multi-statement updates


const pool = require('../database');

async function query(text, params) {
  const res = await pool.query(text, params);
  return res;  
}

async function transaction(fn) {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');
        const results = await fn(client);
        await client.query('COMMIT');
        return results;
    } catch (err) {
        await client.query('ROLLBACK');
        throw err;
    } finally {
        client.release();
    }
}    
    
module.exports = {
  query,
  transaction
};