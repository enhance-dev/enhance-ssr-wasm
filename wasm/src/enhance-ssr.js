import enhance from "@enhance/ssr";
import styleTransform from "@enhance/enhance-style-transform";

export function ssr() {
  const inputJson = Host.inputString();
  const input = JSON.parse(inputJson);

  const html = enhance({
    styleTransforms: [styleTransform],
    elements: mapStringToFunctionObj(input.elements),
    initialState: input.initialState || {},
  });

  Host.outputString(html`${input.markup}`);
}

function mapStringToFunctionObj(obj) {
  const functionObj = {};
  for (const [key, funcString] of Object.entries(obj)) {
    functionObj[key] = (new Function("return " + funcString))();
  }
  return functionObj;
}
