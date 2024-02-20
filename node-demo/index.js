import createPlugin from "@extism/extism";

const plugin = await createPlugin("../wasm/dist/enhance-ssr.wasm", {
	useWasi: true,
});

const input = {
	markup: "<my-header>Hello World</my-header>",
	elements: {
		"my-header":
			"function MyHeader({ html }) { return html`<h1><slot></slot></h1> ` }",
	},
	initialState: {},
};

const output = await plugin.call("ssr", JSON.stringify(input));

console.log(output.text());
