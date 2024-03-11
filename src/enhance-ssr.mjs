import enhance from "@enhance/ssr"
import styleTransform from "@enhance/enhance-style-transform"
// const { hostTime } = Host.getFunctions()


export function ssr() {
  return _ssr()
}

export function _ssr(params) {
  const _Host = params?.Host || Host
  const _Config = params?.Config || Config


  let ssrTimeStart = new Date()

  let configElements = _Config.get("elements")
  if (configElements) { configElements = JSON.parse(configElements) }
  const input = JSON.parse(_Host.inputString())

  const elementStrings = input.elements || configElements || {}


  let prepEnhanceStart = new Date()
  const html = enhance({
    styleTransforms: [styleTransform],
    elements: mapStringToFunctionObj(elementStrings),
    initialState: input.initialState || {},
  })
  let prepEnhanceEnd = new Date()
  const prepTime = prepEnhanceEnd.getTime() - prepEnhanceStart.getTime()

  // let offset = hostTime()
  // let time = Memory.find(offset).readString()
  let timeStart = new Date()
  const htmlString = html`${input.markup}`
  let timeEnd = new Date()
  const parseTime = timeEnd.getTime() - timeStart.getTime()

  let timeDocStart = new Date()
  const output = parseDoc(htmlString)
  let timeDocEnd = new Date()
  const docTime = timeDocEnd.getTime() - timeDocStart.getTime()

  // offset = hostTime()
  // time = Memory.find(offset).readString()

  let ssrTimeEnd = new Date()
  const ssrTime = ssrTimeEnd.getTime() - ssrTimeStart.getTime()
  console.log(`parseTime: ${parseTime.toString()} docTime: ${docTime.toString()} prepTime: ${prepTime.toString()} ssrTime: ${ssrTime.toString()}`)
  _Host.outputString(JSON.stringify(output))
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

  const headContentMatch = htmlString.match(/<head\b[^>]*>([\s\S]*?)<\/head>/);
  const headContent = headContentMatch ? headContentMatch[1] : ''
  const styleMatch = headContent.match(/<style.*?>([\s\S]*?)<\/style>/)
  const styleContent = styleMatch ? styleMatch[1] : ''

  return {
    document: documentContent,
    body: bodyContent,
    styles: styleContent,
  }
}
