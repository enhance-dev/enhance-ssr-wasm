## Enhance SSR WASM

Compiling Enhance SSR to WASM allows server-side rendering of Enhance elements in any language that supports WASM.

This project compiles [enhance-ssr](https://github.com/enhance-dev/enhance-ssr) into an [Extism](https://extism.org/) plugin.
It can be used with any language that Extism has an SDK for including Python, Ruby, .NET, Rust, Go, PHP, Java and more.

## Build and Run
1. Install `extism-js`: `sh install.sh`

2. Build: `npm run build`

## Usage
The plugin accepts a JSON string as input with three properties.
```json
{
  markup: "<my-header>Hello World</my-header>",
  elements: {
    "my-header":
      "function MyHeader({ html }) { return html`<h1><slot></slot></h1>` }",
  },
  initialState: {},
}

```

1. `markup`: HTML string for the page to be rendered.
2. `elements`: Is an Object of elements. The keys are the custom element names and values are string representations of the function for rendering the elements.
3. `initialState`: Is an object of data used to render the components.

The output returned by the plugin is also a JSON string with multiple properties.
```json
{
  document: "<html><head></head><body><my-header enhanced=\"✨\"><h1>Hello World</h1></my-header></body></html>",
  body: "<my-header enhanced=\"✨\"><h1>Hello World</h1></my-header>",
  styles: "",
}

```

