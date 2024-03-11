import { _ssr } from "../../src/enhance-ssr.mjs"

export default function(input = {}) {
  let container = input || {}
  const Host = {
    inputString: () => container.input,
    outputString: (output) => container.output = output,
  }
  const Config = {
    get: (key) => container.config?.[key]
  }

  _ssr({ Host, Config })
  return container.output
}
