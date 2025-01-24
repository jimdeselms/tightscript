type ByteCodes = number[]

export function I32(n: number): ByteCodes {
    return [0x41, ...encodeSize(n)]
}

export const ADD_I32: ByteCodes = [0x6a]
export const LOCAL_GET_0: ByteCodes = [0x20, 0x00]
export const MUL_I32: ByteCodes = [0x6c]

export function compileWasm(bytecodes: ByteCodes): WebAssembly.Exports {
    const size = bytecodes.length

    // Raw bytecode for the WebAssembly module
    const wasmCode = new Uint8Array([
      // WASM binary magic number and version
      0x00, 0x61, 0x73, 0x6d, // \0asm
      0x01, 0x00, 0x00, 0x00, // version 1
  
      // Type section
      0x01,                   // section code: Type
      ...encodeSize(6),                   // section size
      0x01,                   // number of types
      0x60,                   // type form: func
      0x01,                   // number of parameters
      0x7f,                   // parameter type: i32
      0x01,                   // number of results
      0x7f,                   // result type: i32
  
      // Function section
      0x03,                   // section code: Function
      ...encodeSize(2),                   // section size
      0x01,                   // number of functions
      0x00,                   // type index of the function
  
      // Export section
      0x07,                   // section code: Export
      0x0a,                   // section size
      0x01,                   // number of exports
      0x06,                   // string length of export name
      0x64, 0x6f, 0x75, 0x62, 0x6c, 0x65, // export name: "double"
      0x00,                   // export kind: func
      0x00,                   // function index
  
      // Code section
      0x0a,                   // section code: Code
      ...encodeSize(size + 4),                   // section size
      0x01,                   // number of functions
      ...encodeSize(size + 2),                   // function body size
      0x00,                   // local count
      ...bytecodes,
      0x0b                    // end (end of function body)
    ]);
  
    const memory = new WebAssembly.Memory({ initial: 1 });
    const wasmModule = new WebAssembly.Module(wasmCode);
    const wasmInstance = new WebAssembly.Instance(wasmModule, { js: { mem: memory } });

    // const wasmModule = await WebAssembly.compile(wasmCode);
    // const instance = await WebAssembly.instantiate(wasmModule);
    return wasmInstance.exports;
  }

function encodeNumAsBytes(n: number): ByteCodes {
    const bytes = [];
    for (let i = 0; i < 4; i++) {
        bytes.push(n & 0xFF);
        n >>= 8;
    }
    return bytes;
}

function encodeSize(value: number): ByteCodes {
    const bytes = [];
    do {
        let byte = value & 0x7F;
        value >>= 7;
        if (value !== 0) {
        byte |= 0x80;
        }
        bytes.push(byte);
    } while (value !== 0);
    return bytes;
}