import assert from 'node:assert'
import { test } from 'node:test'
import createPlugin from "@extism/extism";

const plugin = await createPlugin("dist/enhance-ssr.wasm", {
  useWasi: true,
})

const input = {
  markup: "<my-header>Hello World</my-header>",
  elements: {
    "my-header":
      "function MyHeader({ html }) { return html`<h1><slot></slot></h1>` }",
  },
  initialState: {},
}
const expected = `<html><head></head><body><my-header enhanced="✨"><h1>Hello World</h1></my-header></body></html>`

test('Read Input Text', async () => {
  const output = await plugin.call("ssr", JSON.stringify(input))
  assert.equal(output.text(), expected)
})



