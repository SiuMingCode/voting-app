const request = require('supertest')

const app = require('../src/app')
const { campaignValidator } = require('../src/campaigns/validators')

test('Hello World', async () => {
  const response = await request(app).get('/')
  expect(response.statusCode).toBe(200)
})

describe('Campaign', () => {
  test('Create campaign', async () => {
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
    campaignValidator(response.body)
    expect(campaignValidator.errors).toBeNull()
  })
})
