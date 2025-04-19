import { SIMPLIFY_HANDLERS } from './handlers/SIMPLIFY_HANDLERS'
import { COMPILE_HANDLERS } from './handlers/COMPILE_HANDLERS'
import { exprToString } from '../parse'

export class Compiler {
    constructor() {
        this.state = {}
        this.simplifyHandlers = SIMPLIFY_HANDLERS(this.state, this.simplify.bind(this), this.compile.bind(this))
        this.compileHandlers = COMPILE_HANDLERS(this.state, this.compile.bind(this))
    }

    compile(sExpr) {
        const asString = exprToString(sExpr)
        if (resolved(sExpr)) {
            return () => sExpr
        } else {
            const simplified = this.simplify(sExpr)
            const simplifiedAsString = exprToString(simplified)
            if (resolved(simplified)) {
                return () => simplified
            } else {
                const [primitive, ...args] = simplified
                const handler = this.compileHandlers[primitive]
                if (!handler) { 
                    throw "Cannot find compile handler " + primitive
                }

                const compiledArgs = args.map(a => this.compile(a))
                return handler(...compiledArgs)
            }
        }
    }

    simplify(sExpr) {
        if (resolved(sExpr)) {
            return sExpr instanceof Error
                ? ['error', sExpr.message]
                : sExpr
        }

        const [primitive, ...args] = sExpr
        const simplifiedArgs = args.map(a => this.simplify(a))

        const handler = this.simplifyHandlers[primitive]
        if (!handler) { 
            // If there's no handler, then the thing is already simplified
            return [primitive, ...simplifiedArgs]
        }

        if (!UNDEFINED_AWARE_PRIMITIVES.includes(primitive)) {
            if (simplifiedArgs.some(arg => arg === undefined)) {
                return undefined
            }
        }

        if (!UNDEFINED_AWARE_PRIMITIVES.includes(primitive)) {
            const errorArg = simplifiedArgs.find(arg => arg instanceof Error)
            if (errorArg) {
                return errorArg
            }
        }

        return handler(...simplifiedArgs)
    }
}

const UNDEFINED_AWARE_PRIMITIVES = [ "isUndefined", "isError" ]
const ERROR_AWARE_PRIMITIVES = [ "isError" ]

function resolved(sExpr) {
    return !Array.isArray(sExpr)
}