declare module 'main' {
  // Extism exports take no params and return an I32
  export function ssr(): I32;
}

// declare module 'extism:host' {
//   interface user {
//     hostTime(ptr: I64): I64;
//   }
// }
