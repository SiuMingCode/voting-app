const { Router } = require('express')

const { jsonBodyValidatingMiddlewareFactory } = require('../middlewares')
const { createCampaignValidator, voteValidator } = require('./validators')
const { isHKID } = require('../utils')

const router = Router()

router.post('/', jsonBodyValidatingMiddlewareFactory(createCampaignValidator), function (req, res) {
  if (!(new Date(req.body.start) < new Date(req.body.end))) {
    return res.status(400).json({
      errorCode: 'INVALID_PLAYLOAD',
      message: 'Start time should be earlier than end time.'
    })
  }

  const campaign = req.body
  campaign.id = '1'
  for (const candidate of campaign.candidates) {
    candidate.id = '1'
  }
  return res.status(201).json(campaign)
})

router.post('/:campaignId/votes', jsonBodyValidatingMiddlewareFactory(voteValidator), function (req, res) {
  if (!(isHKID(req.body.hkid))) {
    return res.status(400).json({
      errorCode: 'INVALID_HKID',
      message: 'Please double check your HKID number input.'
    })
  }

  const campaign = {}
  const now = new Date()
  if (now < campaign.start) {
    return res.status(400).json({
      errorCode: 'NOT_YET_STARTED',
      message: `Campaign will begin at ${campaign.start.toString()}.`
    })
  }
  if (campaign.end < now) {
    return res.status(400).json({
      errorCode: 'ALREADY_ENDED',
      message: 'Campaign has already ended.'
    })
  }

  // TODO: ALREADY_VOTED

  return res.status(201)
})

module.exports = router
