import mock from './mock-harness.mjs'

(function() {

  function myHeader({ html, state }) {
    return html`
    <style>h1 { color: red; }</style><h1><slot></slot></h1>
    <p>Message: ${state?.store?.message || "no message"}</p>`
  }
  let myHeaderString = myHeader.toString()
  let elements = {};
  let htmlString = '';

  for (let i = 0; i <= 1; i++) {
    elements[`my-header-${i}`] = myHeaderString;
  }
  for (let i = 0; i <= 1; i++) {
    htmlString += `<my-header-${i}>Hello</my-header-${i}>`;
  }
  let input = {
    markup: htmlString + "<my-header-1>hello</my-header-1>".repeat(1),
    elements,
    initialState: {},
  }

  console.log("1 element 1 instance")
  const out = mock({ input: JSON.stringify(input) })


  console.log("10 elements 10 instances")
  for (let i = 0; i <= 10; i++) {
    elements[`my-header-${i}`] = myHeaderString;
  }
  for (let i = 0; i <= 10; i++) {
    htmlString += `<my-header-${i}>Hello</my-header-${i}>`;
  }
  input = {
    markup: htmlString + "<my-header-1>hello</my-header-1>".repeat(1),
    elements,
    initialState: {},
  }
  mock({ input: JSON.stringify(input) })

  console.log("100 el 100 inst")
  for (let i = 0; i <= 100; i++) {
    elements[`my-header-${i}`] = myHeaderString;
  }
  for (let i = 0; i <= 100; i++) {
    htmlString += `<my-header-${i}>Hello</my-header-${i}>`;
  }
  input = {
    markup: htmlString + "<my-header-1>hello</my-header-1>".repeat(1),
    elements,
    initialState: {},
  }

  mock({ input: JSON.stringify(input) })

  console.log("1000 el 1000 inst")
  for (let i = 0; i <= 1000; i++) {
    elements[`my-header-${i}`] = myHeaderString;
  }
  for (let i = 0; i <= 1000; i++) {
    htmlString += `<my-header-${i}>Hello</my-header-${i}>`;
  }
  input = {
    markup: htmlString + "<my-header-1>hello</my-header-1>".repeat(1),
    elements,
    initialState: {},
  }

  mock({ input: JSON.stringify(input) })

  console.log(" 1000 el 1 inst")
  for (let i = 0; i <= 1000; i++) {
    elements[`my-header-${i}`] = myHeaderString;
  }
  for (let i = 0; i <= 1; i++) {
    htmlString += `<my-header-${i}>Hello</my-header-${i}>`;
  }
  input = {
    markup: htmlString + "<my-header-1>hello</my-header-1>".repeat(1),
    elements,
    initialState: {},
  }

  mock({ input: JSON.stringify(input) })

  console.log("1 el 1000 inst")
  for (let i = 0; i <= 1; i++) {
    elements[`my-header-${i}`] = myHeaderString;
  }
  for (let i = 0; i <= 1000; i++) {
    htmlString += `<my-header-${i}>Hello</my-header-${i}>`;
  }
  input = {
    markup: htmlString + "<my-header-1>hello</my-header-1>".repeat(1),
    elements,
    initialState: {},
  }

  mock({ input: JSON.stringify(input) })

})()
