const express = require('express')
const helmet = require('helmet')

const campaignsRouter = require('./campaigns/router')

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(helmet())

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.use('/campaigns', campaignsRouter)

module.exports = app
