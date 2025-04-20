import { COMPILE_HANDLERS } from './handlers/COMPILE_HANDLERS'
import { exprToString } from '../parse'

export class Compiler {
    constructor() {
        this.state = {}
//        this.simplifyHandlers = SIMPLIFY_HANDLERS(this.state, this.simplify.bind(this), this.compile.bind(this))
        this.compileHandlers = COMPILE_HANDLERS(this.state, this.compile.bind(this))
    }
    
    compile(sExpr) {
        const sExprAsString = exprToString(sExpr)
        if (resolved(sExpr)) {
            return () => sExpr
        }

        const [primitive, ...args] = sExpr

        const compiledArgs = args.map((arg) => this.compile(arg))

        const handler = this.compileHandlers[primitive]
        if (!handler) {
            throw "Cannot find handler " + primitive
        }

        const compiled = handler(...compiledArgs)

        if (primitive !== 'if' && primitive !== 'isUndefined') {
            // Try to call the compiled expression with no args; if it returns a result, then it's been simplified further.
            const simplifiedResult = compiled()
            if (simplifiedResult !== undefined) {
                if (resolved(simplifiedResult) || simplifiedResult.slice(1).every(e => e !== undefined)) {
                    return this.compile(simplifiedResult)
                }
            }
        }

        return compiled
    }
}

const UNDEFINED_AWARE_PRIMITIVES = [ "isUndefined", "isError" ]
const ERROR_AWARE_PRIMITIVES = [ "isError" ]

function resolved(sExpr) {
    return !Array.isArray(sExpr) || (sExpr[0] === 'error' && resolved(sExpr[1]))
}