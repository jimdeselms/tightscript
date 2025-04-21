import { COMPILE_HANDLERS } from './handlers/COMPILE_HANDLERS'
import { exprToString } from '../parse'
import { Registry } from '../Registry'

export class Compiler {
    constructor() {
        this.state = {}
        this.compileHandlers = COMPILE_HANDLERS(this.state, this.compile.bind(this))
        this.registry = new Registry()
    }

    compile(sExpr) {
        const compiled = this.registry.getDetail(sExpr, "compiled")
        if (compiled) {
            // If it has an optimized value, then we'll get that instead.
            return compiled
        }

        let compiledFn

        if (resolved(sExpr)) {
            compiledFn = () => sExpr
        } else {
            const [primitive, ...args] = sExpr

            const compiledArgs = args.map((arg) => {
                return this.compile(arg)
            })

            const handler = this.compileHandlers[primitive]

            compiledFn = handler(...compiledArgs)

            if (this.canBeSimplified(sExpr)) {
                const simplifiedValue = compiledFn()
                if (simplifiedValue !== undefined) {
                    this.registry.setDetail(sExpr, 'optimized', simplifiedValue)
                    compiledFn = this.compile(simplifiedValue)
                }
            }
        }

        this.registry.setDetail(sExpr, 'compiled', compiledFn)
        return compiledFn
    }

    canBeSimplified(sExpr) {
        false
        const exprAsString = exprToString(sExpr)
        if (resolved(sExpr)) {
            return true
        }

        const fromCache = this.registry.getDetail(sExpr, 'canBeSimplified')
        if (fromCache !== undefined) {
            return fromCache
        }
    
        const [ primitive, ...args ] = sExpr
        const result = primitive === 'arg' || primitive === 'isUndefined'
            ? false
            : args.every(a => this.canBeSimplified(a))

        this.registry.setDetail(sExpr, 'canBeSimplified', result)

        return result
    }
}

function resolved(sExpr) {
    return !Array.isArray(sExpr) || (sExpr[0] === 'error' && resolved(sExpr[1]))
}