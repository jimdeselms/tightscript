import { SIMPLIFY_HANDLERS } from './handlers/SIMPLIFY_HANDLERS'
import { COMPILE_HANDLERS } from './handlers/COMPILE_HANDLERS'

export class Compiler {
    constructor() {
        this.state = {}
        this.simplifyHandlers = SIMPLIFY_HANDLERS(this.state, this.simplify.bind(this), this.compile.bind(this))
        this.compileHandlers = COMPILE_HANDLERS(this.state, this.compile.bind(this))
    }

    compile(sExpr) {
        if (resolved(sExpr)) {
            return () => sExpr
        } else {
            const simplified = this.simplify(sExpr)
            if (resolved(simplified)) {
                return () => simplified
            } else {
                const [primitive, ...args] = simplified
                const handler = this.compileHandlers[primitive]
                if (!handler) { throw "Cannot find compile handler " + primitive}

                const compiledArgs = args.map(a => this.compile(a))
                return handler(...compiledArgs)
            }
        }
    }

    simplify(sExpr) {
        if (resolved(sExpr)) {
            return sExpr
        }

        const [primitive, ...args] = sExpr
        const simplifiedArgs = args.map(a => this.simplify(a))

        const handler = this.simplifyHandlers[primitive]
        if (!handler) { 
            // If there's no handler, then the thing is already simplified
            return [primitive, ...simplifiedArgs]
        }

        if (!PRIMITIVES_THAT_ALLOW_UNDEFINED_ARGS.includes(primitive) && simplifiedArgs.some(arg => arg === undefined)) {
            return undefined
        }

        return handler(...simplifiedArgs)
    }
}

const PRIMITIVES_THAT_ALLOW_UNDEFINED_ARGS = [ "isUndefined" ]

function resolved(sExpr) {
    return !Array.isArray(sExpr)
}