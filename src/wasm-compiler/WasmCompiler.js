import { buildWasm } from './WasmHelpers.js'
import * as fs from 'fs'

export class WasmCompiler {
    constructor() {
        this.ordinalFunctions = []
    }

    declareFunction(i, localTypes, body) {
        const fnBody = {
            locals: localTypes,
            body: this.toWasm(body)
        }

        this.ordinalFunctions[i] = fnBody
    }

    async compile(sExpr) {
        const mainFn = {
            type: 'function',
            locals: [],
            body: this.toWasm(sExpr),
            paramTypes: ['i32'],
            resultTypes: ['i32'],
        }

        const functions = [mainFn, ...this.ordinalFunctions]

        const wasm = buildWasm(functions, [{ name: 'main', type: 'function', index: 0 }])

        const wasmBuffer = new Uint8Array(wasm)
        await fs.promises.writeFile('out.wasm', wasmBuffer)

        const result = await WebAssembly.instantiate(wasmBuffer)
        const main = result.instance.exports.main;

        return main
    }

    toWasm(sExpr, buffer) {
        if (Array.isArray(sExpr)) {
            const [ prim, ...args ] = sExpr
            const primfn = PRIMITIVES[prim]
            if (!primfn) {
                throw `Unknown primitive ` +  prim
            }
            return PRIMITIVES[prim](...args.map(a => this.toWasm(a)))
        } else {
            // This is very simplified; just puts a number on the stack, assuming it's < 128 I believe.
            return [ 0x41, sExpr ]
        }
    }
}

const PRIMITIVES = {
    // This needs to be smarter in case we have many arguments (use LE128 format)
    arg: (i) => [ 0x20, i],
    
    // fnref: (idx) => `$O${idx}`,
    // negate: (val) => `(-${val})`,

    // add: (lhs, rhs) => `(${lhs}+(${rhs}))`,
    // mul: (lhs, rhs) => `(${lhs}*(${rhs}))`,

    // sub: (lhs, rhs) => `(${lhs}-(${rhs}))`,
    // sub_opp: (lhs, rhs) => `(${rhs}-(${lhs}))`,

    // div: (lhs, rhs) => `(${lhs}/(${rhs}))`,
    // div_opp: (lhs, rhs) => `(${rhs}/(${lhs}))`,

    // lt: (a1, a2) => `(${a1}<${a2})`,
    // lt_opp: (a1, a2) => `(${a2}>${a1})`,

    // gt: (a1, a2) => `(${a1}>=${a2})`,
    // gt_opp: (a1, a2) => `(${a2}<=${a1})`,

    // le: (a1, a2) => `(${a1}<=${a2})`,
    // le_opp: (a1, a2) => `(${a2}>=${a1})`,

    // ge: (a1, a2) => `(${a1}>=${a2})`,
    // ge_opp: (a1, a2) => `(${a2}<=${a1})`,

    // error: (val) => `(new Error(${val}))`,

    // if: (cond, ifTrue, ifFalse) => `(${cond}?${ifTrue}:${ifFalse})`,

    // isNumber: (val) => `(typeof ${val}==='number')`,
    // isString: (val) => `(typeof ${val}==='string')`,
    // isBoolean: (val) => `(typeof ${val}==='boolean')`,
    // isUndefined: (val) => `(${val}===undefined)`,
    // isFunction: (val) => `(typeof ${val}==='function')`,
    // isError: (val) => `(${val} instanceof Error)`,
    // fn: (body) => `((...$)=>{return ${body}})`,
    // call: (fn, ...args) => `((${fn})(${args.join(',')}))`,
    // eq: (a1,a2) => `(${a1}===${a2})`,

    // array: (...els) => `[${els.join(',')}]`,
}
