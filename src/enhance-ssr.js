import enhance from "@enhance/ssr"
import styleTransform from "@enhance/enhance-style-transform"

export function ssr() {
  const input = JSON.parse(Host.inputString())

  const html = enhance({
    styleTransforms: [styleTransform],
    elements: mapStringToFunctionObj(input.elements || {}),
    initialState: input.initialState || {},
  })

  const output = parseDoc(html`${input.markup}`)
  Host.outputString(JSON.stringify(output))
}

function mapStringToFunctionObj(obj) {
  const functionObj = {}
  for (const [key, funcString] of Object.entries(obj)) {
    functionObj[key] = (new Function("return " + funcString))()
  }
  return functionObj;
}

function parseDoc(htmlString) {
  const documentContent = htmlString

  const bodyMatch = htmlString.match(/<body.*?>([\s\S]*)<\/body>/)
  const bodyContent = bodyMatch ? bodyMatch[1] : ''

  const headContentMatch = htmlString.match(/<head.*?>([\s\S]*)<\/head>/)
  const headContent = headContentMatch ? headContentMatch[1] : ''
  const styleMatch = headContent.match(/<style.*?>([\s\S]*?)<\/style>/)
  const styleContent = styleMatch ? styleMatch[1] : ''

  return {
    document: documentContent,
    body: bodyContent,
    styles: styleContent,
  }
}

