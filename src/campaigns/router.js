const { Router } = require('express')

const { jsonBodyValidatingMiddlewareFactory } = require('../middlewares')
const { validateCreateCampaignPayload, validateVotePayload, validateCampaignCursor } = require('./validators')
const { isHKID } = require('../utils')
const { createCampaign, getCampaigns, getCampaign, deleteCampaign, voteCampaign } = require('./queries')
const { PG_ERROR_CODE } = require('../db')

const router = Router()

router.post('/', jsonBodyValidatingMiddlewareFactory(validateCreateCampaignPayload), async function (req, res) {
  if (!(new Date(req.body.start) < new Date(req.body.end))) {
    return res.status(400).json({
      errorCode: 'INVALID_PAYLOAD',
      message: 'Start time should be earlier than end time.'
    })
  }

  const campaign = await createCampaign(req.body)
  return res.status(201).json(campaign)
})

router.get('/', async function (req, res) {
  let cursor

  if (req.query.cursor) {
    try {
      cursor = JSON.parse(req.query.cursor)
    } catch (e) {
      if (e instanceof SyntaxError) {
        return res.status(400).json({
          errorCode: 'INVALID_PAYLOAD',
          message: 'Cursor has to be in JSON.'
        })
      } else {
        throw e
      }
    }

    const valid = validateCampaignCursor(cursor)
    if (!valid) {
      return res.status(400).json({
        errorCode: 'INVALID_PAYLOAD',
        message: 'Could not understand the cursor given.',
        details: validateCampaignCursor.errors
      })
    }
  }

  const campaigns = await getCampaigns(cursor)
  return res.status(200).json(campaigns)
})

router.delete('/:campaignId', async function (req, res) {
  await deleteCampaign(req.params.campaignId)
  return res.sendStatus(204)
})

router.post('/:campaignId/votes', jsonBodyValidatingMiddlewareFactory(validateVotePayload), async function (req, res) {
  if (!(isHKID(req.body.hkid))) {
    return res.status(400).json({
      errorCode: 'INVALID_HKID',
      message: 'Please double check your HKID number input.'
    })
  }

  const campaign = await getCampaign(req.params.campaignId)
  if (!campaign) {
    return res.status(404).json({
      errorCode: 'NOT_FOUND',
      message: `Campaign ${req.params.campaignId} does not exist.`
    })
  }

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

  const ballot = {
    campaignId: req.params.campaignId,
    ...req.body
  }

  try {
    await voteCampaign(ballot)
  } catch (e) {
    if (e.code === PG_ERROR_CODE.UNIQUE_VIOLATION) {
      return res.status(400).json({
        errorCode: 'ALREADY_VOTED',
        message: 'You have already voted this campaign.'
      })
    } else {
      throw e
    }
  }

  return res.sendStatus(204)
})

module.exports = router
