const Ajv = require('ajv')
const { campaignSchema, createCampaignSchema, voteSchema } = require('./schemas')

const ajv = new Ajv()

const campaignValidator = ajv.compile(campaignSchema)
const createCampaignValidator = ajv.compile(createCampaignSchema)
const voteValidator = ajv.compile(voteSchema)

module.exports = {
  campaignValidator,
  createCampaignValidator,
  voteValidator
}
