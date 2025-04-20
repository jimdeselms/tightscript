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

        const compiledArgs = args.map((arg) => {
            return this.compile(arg)
        })

        const handler = this.compileHandlers[primitive]

        const compiledFn = handler(...compiledArgs)

        if (canBeSimplified(sExpr)) {
            const simplifiedValue = compiledFn()
            if (simplifiedValue !== undefined) {
                return this.compile(simplifiedValue)
            }
        }

        return compiledFn
    }
}

function canBeSimplified(sExpr) {
    if (resolved(sExpr)) {
        return true
    }

    const [ primitive, ...args ] = sExpr
    if (primitive === 'arg') {
        return false
    }

    return args.every(canBeSimplified)
}

const UNDEFINED_AWARE_PRIMITIVES = [ "isUndefined", "isError" ]
const ERROR_AWARE_PRIMITIVES = [ "isError" ]

function resolved(sExpr) {
    return !Array.isArray(sExpr) || (sExpr[0] === 'error' && resolved(sExpr[1]))
}