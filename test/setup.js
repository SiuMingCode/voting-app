const fs = require('fs')
const path = require('path')
const { Client } = require('pg')

const { pool } = require('../src/db')

const maintenanceClient = new Client({
  user: process.env.PGUSER,
  host: process.env.PGHOST,
  database: 'postgres',
  password: process.env.PGPASSWORD,
  port: process.env.PGPORT
})

beforeAll(async () => {
  await maintenanceClient.connect()

  await maintenanceClient.query(`DROP DATABASE IF EXISTS ${process.env.PGDATABASE}_test WITH (FORCE)`)
  await maintenanceClient.query(`CREATE DATABASE ${process.env.PGDATABASE}_test`)

  // migrate all schemas
  const sqlFiles = fs.readdirSync('migrations', { withFileTypes: true })
    .filter(dirent => dirent.isFile() && path.extname(dirent.name) === '.sql')
    .map(dirent => dirent.name)
  for (const sqlFile of sqlFiles) {
    const statments = fs.readFileSync('migrations/' + sqlFile, 'utf8')
    await pool.query(statments)
  }
}, 30000)

afterAll(async () => {
  await pool.end()
  await maintenanceClient.end()
}, 30000)
