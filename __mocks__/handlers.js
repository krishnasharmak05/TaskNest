// __mocks__/handlers.js
const { http, HttpResponse } = require('msw')

const handlers = [
  http.get('/api/projects', () => {
    return HttpResponse.json([
      {
        id: "123",
        name: "Integration Testing FTW",
        description: "Testing Dashboard component",
        createdAt: new Date().toISOString(),
        ownerId: "user-1"
      }
    ])
  }),
]

module.exports = { handlers }