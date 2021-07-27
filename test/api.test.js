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
