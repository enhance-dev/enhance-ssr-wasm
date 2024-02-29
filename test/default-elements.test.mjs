import assert from 'node:assert'
import { test } from 'node:test'
import createPlugin from "@extism/extism";

const plugin = await createPlugin("dist/enhance-ssr.wasm", {
  useWasi: true,
  config: {
    elements: JSON.stringify({
      "my-header":
        "function MyHeader({ html }) { return html`<style>h1{color:red;}</style><h1><slot></slot></h1>` }",
    })
  },
})

const input = {
  markup: "<my-header>Hello World</my-header>",
  initialState: {},
}
const expected = {
  document: "<html><head><style>my-header h1 {\n  color: red;\n}</style></head><body><my-header enhanced=\"✨\"><h1>Hello World</h1></my-header></body></html>",
  body: "<my-header enhanced=\"✨\"><h1>Hello World</h1></my-header>",
  styles: "my-header h1 {\n  color: red;\n}",
}

test('Read Input Text', async () => {
  const output = await plugin.call("ssr", JSON.stringify(input))
  const parsedOutput = JSON.parse(output.text())
  assert.deepEqual(parsedOutput, expected)
})



