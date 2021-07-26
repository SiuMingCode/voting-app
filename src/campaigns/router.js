const { Router } = require('express')
const { jsonBodyValidatingMiddlewareFactory } = require('../middlewares')
const { createCampaignValidator } = require('./validators')

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

module.exports = router
