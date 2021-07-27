const request = require('supertest')

const app = require('../src/app')
const { validateCampaign } = require('../src/campaigns/validators')
const { createCampaign } = require('../src/campaigns/queries')

test('Hello World', async () => {
  const response = await request(app).get('/')
  expect(response.statusCode).toBe(200)
})

describe('Create campaign', () => {
  test('Success case', async () => {
    const campaignToCreate = {
      title: 'What...?',
      start: '2021-07-24T00:00:00Z',
      end: '2021-07-25T00:00:00Z',
      candidates: [
        {
          title: 'option1'
        }
      ]
    }
    const response = await request(app).post('/campaigns').send(campaignToCreate)
    expect(response.statusCode).toBe(201)
    validateCampaign(response.body)
    expect(validateCampaign.errors).toBeNull()
  })

  test('Invalid start and end', async () => {
    const campaignToCreate = {
      title: 'What...?',
      start: '2021-07-25T00:00:00Z',
      end: '2021-07-24T00:00:00Z',
      candidates: [
        {
          title: 'option1'
        }
      ]
    }
    const response = await request(app).post('/campaigns').send(campaignToCreate)
    expect(response.statusCode).toBe(400)
    expect(response.body.errorCode === 'INVALID_PAYLOAD')
  })
})

describe('Vote campaign', () => {
  test('Success case', async () => {
    const now = new Date()
    const tmr = new Date()
    tmr.setDate(now.getDate() + 1)
    const campaignToCreate = {
      title: 'What...?',
      start: now.toISOString(),
      end: tmr.toISOString(),
      candidates: [
        {
          title: 'option1'
        }
      ]
    }
    const campaign = await createCampaign(campaignToCreate)

    const votePayload = {
      candidateTitle: campaign.candidates[0].title,
      hkid: 'Y123456(9)'
    }
    const response = await request(app).post(`/campaigns/${campaign.campaignId}/votes`).send(votePayload)
    expect(response.statusCode).toBe(204)
  })

  describe('Fail cases', () => {
    test('Already voted', async () => {
      const now = new Date()
      const tmr = new Date()
      tmr.setDate(now.getDate() + 1)
      const campaignToCreate = {
        title: 'What...?',
        start: now.toISOString(),
        end: tmr.toISOString(),
        candidates: [
          {
            title: 'option1'
          }
        ]
      }
      const campaign = await createCampaign(campaignToCreate)

      const votePayload = {
        candidateTitle: campaign.candidates[0].title,
        hkid: 'Y123456(9)'
      }
      await request(app).post(`/campaigns/${campaign.campaignId}/votes`).send(votePayload)
      const response = await request(app).post(`/campaigns/${campaign.campaignId}/votes`).send(votePayload)
      expect(response.statusCode).toBe(400)
      expect(response.body.errorCode).toBe('ALREADY_VOTED')
    })

    test('Campaign not yet started', async () => {
      const now = new Date()
      const tmr = new Date()
      tmr.setDate(now.getDate() + 1)
      const campaignToCreate = {
        title: 'What...?',
        start: tmr.toISOString(),
        end: tmr.toISOString(),
        candidates: [
          {
            title: 'option1'
          }
        ]
      }
      const campaign = await createCampaign(campaignToCreate)

      const votePayload = {
        candidateTitle: campaign.candidates[0].title,
        hkid: 'Y123456(9)'
      }
      const response = await request(app).post(`/campaigns/${campaign.campaignId}/votes`).send(votePayload)
      expect(response.statusCode).toBe(400)
      expect(response.body.errorCode).toBe('NOT_YET_STARTED')
    })

    test('Campaign alreaday ended', async () => {
      const now = new Date()
      const yesterday = new Date()
      yesterday.setDate(now.getDate() - 1)
      const campaignToCreate = {
        title: 'What...?',
        start: yesterday.toISOString(),
        end: yesterday.toISOString(),
        candidates: [
          {
            title: 'option1'
          }
        ]
      }
      const campaign = await createCampaign(campaignToCreate)

      const votePayload = {
        candidateTitle: campaign.candidates[0].title,
        hkid: 'Y123456(9)'
      }
      const response = await request(app).post(`/campaigns/${campaign.campaignId}/votes`).send(votePayload)
      expect(response.statusCode).toBe(400)
      expect(response.body.errorCode).toBe('ALREADY_ENDED')
    })

    test('Invalid HKID', async () => {
      const now = new Date()
      const tmr = new Date()
      tmr.setDate(now.getDate() + 1)
      const campaignToCreate = {
        title: 'What...?',
        start: now.toISOString(),
        end: tmr.toISOString(),
        candidates: [
          {
            title: 'option1'
          }
        ]
      }
      const campaign = await createCampaign(campaignToCreate)

      const votePayload = {
        candidateTitle: campaign.candidates[0].title,
        hkid: 'Y123456(1)'
      }
      const response = await request(app).post(`/campaigns/${campaign.campaignId}/votes`).send(votePayload)
      expect(response.statusCode).toBe(400)
      expect(response.body.errorCode).toBe('INVALID_HKID')
    })

    test('Campaign not exist', async () => {
      const votePayload = {
        candidateTitle: 'foo',
        hkid: 'Y123456(9)'
      }
      const response = await request(app).post('/campaigns/0/votes').send(votePayload)
      expect(response.statusCode).toBe(404)
      expect(response.body.errorCode).toBe('NOT_FOUND')
    })
  })
})
