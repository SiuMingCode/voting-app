const request = require('supertest')
const app = require('../src/app')

test('Hello World', async () => {
  const response = await request(app).get('/')
  expect(response.statusCode).toBe(200)
})
