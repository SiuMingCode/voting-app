const { Pool } = require('pg')

const pool = new Pool({
  user: process.env.PGUSER,
  host: process.env.PGHOST,
  database: process.env.NODE_ENV === 'test' ? process.env.PGDATABASE + '_test' : process.env.PGDATABASE,
  password: process.env.PGPASSWORD,
  port: process.env.PGPORT
})

const PG_ERROR_CODE = {
  UNIQUE_VIOLATION: '23505'
}

module.exports = {
  pool,
  PG_ERROR_CODE
}
