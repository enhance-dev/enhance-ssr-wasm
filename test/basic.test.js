import { exec } from 'child_process';
import { test } from 'node:test'
import assert from 'node:assert'

test('Read Input Text', async () => {
  const { stdout, stderr } = await runShellCommand('cat ./test/stuff.json')
  assert.equal(stdout.trim(), 'stuff')
})

const input = `{
  "markup": "<my-header>Hello World</my-header>",
  "elements": {
    "my-header": "function MyHeader({ html }) { return html\`< h1 > <slot></slot></h1> \` }"
  },
  "initialState": {}
}`
const expected = '<html><head></head><body><my-header enhanced="✨"><h1>Hello World</h1></my-header></body></html>'
test('Should expand some HTML', async () => {
  const { stdout, stderr } = await runShellCommand(`echo ${input} | ./bin/wasmtime ./.build/enhance.wasm `)
  assert.equal(stdout.trim(), expected)
})



function runShellCommand(command) {
  return new Promise((resolve, reject) => {
    exec(command, (error, stdout, stderr) => {
      if (error) {
        reject(error);
        return;
      }
      resolve({ stdout, stderr });
    });
  });
}
