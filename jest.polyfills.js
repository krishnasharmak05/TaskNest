// ----------------------------------------------
// Fix TextEncoder / TextDecoder (Node 22 issue)
// ----------------------------------------------
import { TextEncoder, TextDecoder } from "util";

if (!global.TextEncoder) global.TextEncoder = TextEncoder;
if (!global.TextDecoder) global.TextDecoder = TextDecoder;

// ----------------------------------------------
// Polyfill Streams (Node 22 removed them)
// ----------------------------------------------
if (typeof global.ReadableStream === "undefined") {
  const {
    ReadableStream,
    WritableStream,
    TransformStream,
  } = require("web-streams-polyfill");

  global.ReadableStream = ReadableStream;
  global.WritableStream = WritableStream;
  global.TransformStream = TransformStream;
}

// ----------------------------------------------
// **MOST IMPORTANT** — Polyfill WHATWG fetch API
// MSW requires these even in "node" mode.
// JSDOM DOES NOT PROVIDE THEM.
// ----------------------------------------------
if (typeof global.Headers === "undefined") {
  const { Headers, Request, Response, fetch } = require("undici");

  global.Headers = Headers;
  global.Request = Request;
  global.Response = Response;
  global.fetch = fetch;
}

// ----------------------------------------------
// Fetch for Next.js internals
// ----------------------------------------------
import "whatwg-fetch";
