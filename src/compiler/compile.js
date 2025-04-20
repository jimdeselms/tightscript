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
        const exprDetails = this.registry.get(sExpr)
        if (exprDetails?.compiled) {
            // If it has an optimized value, then we'll get that instead.
            return exprDetails.compiled
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

            let simp = this.registry.getDetail(sExpr, 'canBeSimplified')
            if (simp === undefined) {
                simp = canBeSimplified(sExpr)
                this.registry.setDetail(sExpr, 'canBeSimplified', simp)
            }

            if (simp) {
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
}

function canBeSimplified(sExpr) {
    if (resolved(sExpr)) {
        return true
    }

    const [ primitive, ...args ] = sExpr
    if (primitive === 'arg' || primitive === 'isUndefined') {
        return false
    }

    return args.every(canBeSimplified)
}

function resolved(sExpr) {
    return !Array.isArray(sExpr) || (sExpr[0] === 'error' && resolved(sExpr[1]))
}