const Ajv = require('ajv')
const { campaignSchema, createCampaignSchema, voteSchema, campaignCursorSchmea } = require('./schemas')

const ajv = new Ajv()

const campaignValidator = ajv.compile(campaignSchema)
const createCampaignValidator = ajv.compile(createCampaignSchema)
const voteValidator = ajv.compile(voteSchema)
const campaignCursorValidator = ajv.compile(campaignCursorSchmea)

module.exports = {
  campaignValidator,
  createCampaignValidator,
  voteValidator,
  campaignCursorValidator
}
