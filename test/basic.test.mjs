import { exec } from 'child_process'
import assert from 'node:assert'
import { test } from 'node:test'

const expected = `<html><head></head><body><my-header enhanced="✨"><h1>Hello World</h1> </my-header></body></html>`
test('Read Input Text', async () => {
  const { stdout, stderr } = await runShellCommand('extism call dist/enhance-ssr.wasm ssr --input="$(cat test/test.json)" --wasi')
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
