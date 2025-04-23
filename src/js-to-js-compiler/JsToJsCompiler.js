import { JavascriptCompiler } from '../jsCompiler/JavascriptCompiler';
import { FinalCompiler } from '../final-compiler/FinalCompiler';

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
}