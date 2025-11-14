// jest.setup.js

// Polyfill TextEncoder/TextDecoder FIRST
const { TextEncoder, TextDecoder } = require('util')
global.TextEncoder = TextEncoder
global.TextDecoder = TextDecoder

// Polyfill streams - try without /ponyfill
const streams = require('web-streams-polyfill')
global.ReadableStream = streams.ReadableStream
global.WritableStream = streams.WritableStream
global.TransformStream = streams.TransformStream

// Polyfill fetch for jsdom
require('whatwg-fetch')

// Import jest-dom matchers
require('@testing-library/jest-dom')

// Polyfill BroadcastChannel for MSW v2
global.BroadcastChannel = class BroadcastChannel {
  constructor(name) {
    this.name = name
  }
  postMessage() {}
  close() {}
  addEventListener() {}
  removeEventListener() {}
}

// Suppress React act warnings
const originalError = console.error
beforeAll(() => {
  console.error = (...args) => {
    const message = args[0]
    if (
      typeof message === 'string' &&
      (message.includes('Was not wrapped in act') ||
       message.includes('not wrapped in act'))
    ) {
      return
    }
    originalError.call(console, ...args)
  }
})

afterAll(() => {
  console.error = originalError
})

// Import server AFTER all polyfills
const { server } = require('./__mocks__/server.js')

// Setup MSW
beforeAll(() => server.listen({ onUnhandledRequest: 'warn' }))
afterEach(() => server.resetHandlers())
afterAll(() => server.close())