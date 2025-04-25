import { JavascriptCompiler } from '../jsCompiler/JavascriptCompiler.js';
import { FinalCompiler } from '../final-compiler/FinalCompiler.js';
import { WasmCompiler } from '../wasm-compiler/WasmCompiler.js';

export class JsToJsCompiler {
    constructor() {
    }

    compile(code) {
        const jsCompiler = new JavascriptCompiler()
        const { ordinalFunctions, optimizedExpr } = jsCompiler.optimize(code)
    
        const compiler = new FinalCompiler()
        for (let i = 0; i < ordinalFunctions.length; i++) {
            compiler.declareFunction(i, ordinalFunctions[i])
        }
    
        const compiled = compiler.compile(optimizedExpr)

        return compiled
    }

    compileToWebAssembly(code) {
        const jsCompiler = new JavascriptCompiler()
        const { ordinalFunctions, optimizedExpr } = jsCompiler.optimize(code)
    
        const compiler = new WasmCompiler()
        // for (let i = 0; i < ordinalFunctions.length; i++) {
        //     compiler.declareFunction(i, ordinalFunctions[i])
        // }
    
        const compiled = compiler.compile(optimizedExpr)

        return compiled
   }

   compileToInternalFunction(code) {
        const jsCompiler = new JavascriptCompiler()
        const fn = jsCompiler.compile(code)
        return fn
    }
}