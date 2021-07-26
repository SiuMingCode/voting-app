const Ajv = require('ajv')
const { campaignSchema, createCampaignSchema, voteSchema, campaignCursorSchmea } = require('./schemas')

const ajv = new Ajv()

const validateCampaign = ajv.compile(campaignSchema)
const validateCreateCampaignPayload = ajv.compile(createCampaignSchema)
const validateVotePayload = ajv.compile(voteSchema)
const validateCampaignCursor = ajv.compile(campaignCursorSchmea)

module.exports = {
  validateCampaign,
  validateCreateCampaignPayload,
  validateVotePayload,
  validateCampaignCursor
}
