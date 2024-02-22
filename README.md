## Enhance SSR WASM

Compiling Enhance SSR to WASM allows server-side rendering of Enhance elements in any language that supports WASM.

This project compiles [enhance-ssr](https://github.com/enhance-dev/enhance-ssr) into an [Extism](https://extism.org/) plugin.
It can be used with any language that Extism has an SDK for including Python, Ruby, .NET, Rust, Go, PHP, Java and more.

## Build
1. Install `extism-js` pdk: `sh install.sh`

2. Build: `npm run build`

## Usage

### Input:
The plugin accepts a JSON string as input with three properties.
```json
{
  "markup": "<my-header>Hello World</my-header>",
  "elements": {
    "my-header":
      "function MyHeader({ html }) { return html`<style>h1{color:red;}</style><h1><slot></slot></h1>` }",
  },
  "initialState": {},
}

```

1. `markup`: HTML string for the page to be rendered.
2. `elements`: Is an Object of elements. The keys are the custom element names and values are string representations of the function for rendering the elements.
3. `initialState`: Is an object of data used to render the components.

### Output:
The output returned by the plugin is also a JSON string with multiple properties.
```json
{
  "document": "<html><head><style>my-header h1 {\n  color: red;\n}</style></head><body><my-header enhanced=\"✨\"><h1>Hello World</h1></my-header></body></html>",
  "body": "<my-header enhanced=\"✨\"><h1>Hello World</h1></my-header>",
  "styles": "my-header h1 {\n  color: red;\n}",
}

```


```javascript
import createPlugin from "@extism/extism";

const plugin = await createPlugin("dist/enhance-ssr.wasm", {
  useWasi: true,
})

const input = {
  markup: "<my-header>Hello World</my-header>",
  elements: {
    "my-header":
      "function MyHeader({ html }) { return html`<style>h1{color:red;}</style><h1><slot></slot></h1>` }",
  },
  initialState: {},
}

const output = await plugin.call("ssr", JSON.stringify(input))
const parsedOutput = JSON.parse(output.text())
const htmlDoc = parsedOutput.document 

})

```

## Latest Release:
The [latest release](https://github.com/enhance-dev/enhance-ssr-wasm/releases/latest) of the compiled plugin can be found under the Releases on this repository.

To use download the `enhance-ssr.wasm.gz` file and unzip it. 
