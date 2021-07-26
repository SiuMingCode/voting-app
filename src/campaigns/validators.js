const Ajv = require('ajv')
const { campaignSchema, createCampaignSchema } = require('./schemas')

const ajv = new Ajv()

const campaignValidator = ajv.compile(campaignSchema)
const createCampaignValidator = ajv.compile(createCampaignSchema)

module.exports = {
  campaignValidator,
  createCampaignValidator
}
