import mock from './mock-harness.mjs'

(async function() {

  function myHeader({ html, state }) {
    return html`
    <style>h1 { color: red; }</style><h1><slot></slot></h1>
    <p>Message: ${state?.store?.message || "no message"}</p>`
  }
  let myHeaderString = myHeader.toString()


  async function runProfile(params) {
    const { elements = 0, matchingInstances = 0, unregisteredInstances = 0, registeredInstances = 0 } = params

    console.log("\n** NEW DATA POINT **\n")
    console.log("** START JSON ** \n", JSON.stringify(params), "\n** END JSON **")

    let els = {};
    if (elements) {
      for (let i = 0; i <= elements; i++) {
        els[`my-header-${i}`] = myHeaderString;
      }
    }

    let htmlString = '';
    if (matchingInstances) {
      for (let i = 0; i <= matchingInstances; i++) {
        htmlString += `<my-header-${i}>Hello</my-header-${i}>`;
      }
    }

    let htmlStringDefined = "<my-header-0>hello</my-header-0>".repeat(registeredInstances)
    let htmlStringUnRegistered = "<not-found>hello</not-found>".repeat(unregisteredInstances)

    let input = {
      markup: `${htmlString}${registeredInstances ? htmlStringDefined : ''}${unregisteredInstances ? htmlStringUnRegistered : ''}`,
      elements: els,
      initialState: {},
    }

    console.log("QuickJS: ")
    mock({ input: JSON.stringify(input) })
    console.log("\n** END DATA POINT **\n")


  }


  function markGroup(meta) {
    const {
      groupLabel = "Group Label",
      xLabel = "X Label",
      xValue = "elements",
      yLabel = "Y Label",
      yValue = "parseTime" } = meta

    console.log("\n** NEW GROUP **\n")
    console.log("** START JSON **\n")
    console.log(JSON.stringify(meta))
    console.log("\n** END JSON **")
  }
  function endGroup() {
    console.log("\n** END GROUP **\n")
  }



  markGroup({ groupLabel: "Matching Elements and Instances", xLabel: "Elements Count", xValue: "elements", yLabel: "SSR Time (ms)", yValue: "ssrTime" })
  await runProfile({ elements: 0, matchingInstances: 0, registeredInstances: 0, unregisteredInstances: 0 })
  await runProfile({ elements: 1, matchingInstances: 1, registeredInstances: 0, unregisteredInstances: 0 })
  await runProfile({ elements: 10, matchingInstances: 10, registeredInstances: 0, unregisteredInstances: 0 })
  await runProfile({ elements: 100, matchingInstances: 100, registeredInstances: 0, unregisteredInstances: 0 })
  await runProfile({ elements: 1000, matchingInstances: 1000, registeredInstances: 0, unregisteredInstances: 0 })
  endGroup()

  markGroup({ groupLabel: "Registered Instances with One Element", xLabel: "Instances Count", xValue: "registeredInstances", yLabel: "SSR Time (ms)", yValue: "ssrTime" })
  await runProfile({ elements: 1, matchingInstances: 0, registeredInstances: 0, unregisteredInstances: 0 })
  await runProfile({ elements: 1, matchingInstances: 0, registeredInstances: 1, unregisteredInstances: 0 })
  await runProfile({ elements: 1, matchingInstances: 0, registeredInstances: 10, unregisteredInstances: 0 })
  await runProfile({ elements: 1, matchingInstances: 0, registeredInstances: 100, unregisteredInstances: 0 })
  await runProfile({ elements: 1, matchingInstances: 0, registeredInstances: 1000, unregisteredInstances: 0 })
  endGroup()


  markGroup({ groupLabel: "Unregistered Instances with One Element", xLabel: "Instances Count", xValue: "unregisteredInstances", yLabel: "SSR Time (ms)", yValue: "ssrTime" })
  await runProfile({ elements: 1, matchingInstances: 0, registeredInstances: 0, unregisteredInstances: 0 })
  await runProfile({ elements: 1, matchingInstances: 0, registeredInstances: 0, unregisteredInstances: 1 })
  await runProfile({ elements: 1, matchingInstances: 0, registeredInstances: 0, unregisteredInstances: 10 })
  await runProfile({ elements: 1, matchingInstances: 0, registeredInstances: 0, unregisteredInstances: 100 })
  await runProfile({ elements: 1, matchingInstances: 0, registeredInstances: 0, unregisteredInstances: 1000 })
  endGroup()

  markGroup({ groupLabel: "Elements with one Instance on Page", xLabel: "Elements Count", xValue: "elements", yLabel: "SSR Time (ms)", yValue: "ssrTime" })
  await runProfile({ elements: 0, matchingInstances: 0, registeredInstances: 1, unregisteredInstances: 0 })
  await runProfile({ elements: 1, matchingInstances: 0, registeredInstances: 1, unregisteredInstances: 0 })
  await runProfile({ elements: 10, matchingInstances: 0, registeredInstances: 1, unregisteredInstances: 0 })
  await runProfile({ elements: 100, matchingInstances: 0, registeredInstances: 1, unregisteredInstances: 0 })
  await runProfile({ elements: 1000, matchingInstances: 0, registeredInstances: 1, unregisteredInstances: 0 })
  endGroup()

})()
