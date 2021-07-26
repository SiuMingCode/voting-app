const { Pool } = require('pg')

const pool = new Pool()

const PG_ERROR_CODE = {
  UNIQUE_VIOLATION: '23505'
}

module.exports = {
  pool,
  PG_ERROR_CODE
}
