import * as fs from 'fs'

const wasmBuffer = fs.readFileSync('./test.wasm');

WebAssembly.instantiate(wasmBuffer).then(result => {
  const add = result.instance.exports.add;
  console.log(add(10, 7)); // Outputs: 17
});