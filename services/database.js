const { Pool } = require("pg");
const dbConfig = require("../config/database.js");

let pool;

async function initialize() {
  pool = new Pool(dbConfig.pgPool);
}

async function close() {
  if (pool) {
    await pool.end();
  }
}

async function execute(statement, binds = []) {
  try {
    const result = await pool.query(statement, binds);
    return result; // result.rows, result.rowCount
  } catch (err) {
    console.error(err);
    throw err;
  }
}

module.exports = {
  initialize,
  close,
  execute
};