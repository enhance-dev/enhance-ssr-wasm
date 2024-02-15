import enhance from '@enhance/ssr'
import styleTransform from '@enhance/enhance-style-transform'
import { readFileSync, writeFileSync, STDIO } from `javy/fs`

const inputBuffer = readFileSync(STDIO.Stdin)
const input = JSON.parse(new TextDecoder().decode(inputBuffer))

const textEncoder = new TextEncoder()

const output = ssr({
  elements: mapStringToFunctionObj(input.elements),
  initialState: input.initialState || {},
  markup: input.markup
})

writeFileSync(STDIO.Stdout, textEncoder.encode(output));
writeFileSync(STDIO.Stderr, textEncoder.encode("--SSR Complete--"));


function ssr({ elements = {}, initialState = {}, markup = '' }) {
  const html = enhance({
    styleTransforms: [styleTransform],
    elements,
    initialState,
  })
  return html`${markup}`
}

function mapStringToFunctionObj(obj) {
  const functionObj = {};
  for (const [key, funcString] of Object.entries(obj)) {
    functionObj[key] = (new Function("return " + funcString))();
  }
  return functionObj;
}

//TODO: Add error handling to std error
//TODO: Return styles, body, and whole document
//TODO: Wrap html element in function signature going in. Or add this to Enhance SSR.
