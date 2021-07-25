const Ajv = require('ajv')
const { campaignSchema, createCampaignSchema } = require('./schemas')

const ajv = new Ajv()

const campaignValidator = ajv.compile(campaignSchema)
const createCampaignSchemaValidator = ajv.compile(createCampaignSchema)

module.exports = {
  campaignValidator,
  createCampaignSchemaValidator
}
