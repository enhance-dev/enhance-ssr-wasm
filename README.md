## Enhance SSR WASM

Compiling Enhance SSR to WASM allows support for many runtimes like Python and Ruby. 

This uses [Javy](https://github.com/bytecodealliance/javy) to compile enhance along with an embedded JavaScript runtime ([QuickJS](https://github.com/bellard/quickjs)).
The resulting WASM module requires a [WASI](https://wasi.dev/) (Web Assembly System Interface) compatible environment like [wasmtime](https://docs.wasmtime.dev/introduction.html).
Wasmtime has supported packages for many [languages](https://docs.wasmtime.dev/lang.html) (including, python, ruby, rust, etc.).
There is also a browser shim to run in the [browser](https://github.com/bjorn3/browser_wasi_shim) although this not necessary because enhance can be bundled direcly in JS for the browser. 

The compiled wasm reads from stdin and writes to stdout so inputs (element, state, and markup) need to be written as a string. 
The demo has elements compiled with the WASM binary which is not practical for a real use case. 
In a working prototype the elements could be passed as strings and initialized as functions with a `new Function()`.

## Try it without building
The compiled wasm is included in the repository. Give it a try. 
1. Install [Wasmtime](https://wasmtime.dev/) to test the output.  
2. Run `cat input.json | wasmtime enhance.wasm` to see results. 

## Build and Run
1. Enhance css parser has some node api's that are not needed but must be removed to compile. 
Credit to @tbeseda for the following steps to remove them.
  - `@enhance/css-parser` has a reference to `'node:fs'` to support import maps. 
Comment out the conditional that dynamically requires `source-map-support.js` to in `node_modules/@enhance/css-parser/lib/stringify/index.js` to enable the build.

2. Enhance uses `nanoid` to generate instance id's. 
QuickJS does not fully support `crypto` yet, but these instance ids do not need to be secure.
Comment out references to nanoid in `node_modules/@enhance/ssr/index.js`.
Replace the `uuidFuction` in the options with the following function.

```javascript
function fakeUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}
```
This is not for secure applications.

3. Download `javy` [built for your environment](https://github.com/bytecodealliance/javy/releases) to `/javy` folder.

4. Build JS and compile WASM with `npm run build`

5. Install [Wasmtime](https://wasmtime.dev/) to test the output.  

6. Run `cat input.json | wasmtime enhance.wasm` to see results. 
