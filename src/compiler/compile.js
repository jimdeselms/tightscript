import { COMPILE_HANDLERS } from './handlers/COMPILE_HANDLERS'
import { exprToString } from '../parse'
import { Registry } from '../Registry'

export class Compiler {
    constructor() {
        this.state = {
            fns: [],
            knownConditions: new Map()
        }
        this.compileHandlers = COMPILE_HANDLERS(this.state, this.compile.bind(this))
        this.registry = new Registry()
    }

    declareFunction(ordinal, body) {
        this.state.fns[ordinal] = this.compile(['fn', body])()
    }

    optimize(sExpr) {
        const [ _, optimized ] = this.compileImpl(sExpr)
        return optimized
    }

    compile(sExpr) {
        const [ fn ] = this.compileImpl(sExpr)
        return fn
    }

    compileImpl(sExpr) {
        let optimized = this.registry.getDetail(sExpr, "optimized")
        let compiledFn = this.registry.getDetail(sExpr, "compiled")

        if (compiledFn) {
            // If it has an optimized value, then we'll get that instead.
            return [ compiledFn, optimized ]
        } else if (resolved(sExpr)) {
            optimized = sExpr
            compiledFn = () => sExpr
        } else {
            const [primitive, ...args] = sExpr

            if (primitive === 'if') {
                const [cond, ifTrue, ifFalse] = args
                const [ccond, coptimized] = this.compileImpl(cond)
                const condSha = this.registry.getDetail(cond, 'sha')

                const currentValue = this.state.knownConditions.get(condSha)

                if (currentValue !== undefined) {
                    [ compiledFn, optimized ] = currentValue
                        ? this.compileImpl(ifTrue)
                        : this.compileImpl(ifFalse)
                } else if (typeof coptimized === 'boolean') {
                    if (coptimized) {
                        this.state.knownConditions.set(condSha, true)
                        const result = this.compileImpl(ifTrue)
                        compiledFn = result[0]
                        optimized = result[1]
                        this.state.knownConditions.delete(condSha)
                    } else {
                        this.state.knownConditions.set(condSha, false)
                        const result = this.compileImpl(ifFalse)
                        compiledFn = result[0]
                        optimized = result[1]
                        this.state.knownConditions.delete(condSha)
                    }
                } else {
                    this.state.knownConditions.set(condSha, true)
                    const [cIfTrue, oIfTrue] = this.compileImpl(ifTrue)
                    this.state.knownConditions.set(condSha, false)
                    const [cIfFalse, oIfFalse] = this.compileImpl(ifFalse)
                    this.state.knownConditions.delete(condSha)

                    optimized = ['if', coptimized, oIfTrue, oIfFalse]
                    compiledFn = this.compileHandlers.if(ccond, cIfTrue, cIfFalse)
                }
            } else {
                const compiledArgs = args.map((arg) => {
                    return this.compileImpl(arg)
                })

                const handler = this.compileHandlers[primitive]
                if (!handler) {
                    throw new Error(`No handler for primitive: ${primitive}`)
                }

                optimized = [primitive, ...compiledArgs.map(a => a[1])]
                compiledFn = handler(...compiledArgs.map(a => a[0]))

                if (this.canBeSimplified(sExpr)) {
                    const simplifiedValue = compiledFn()
                    if (simplifiedValue !== undefined) {
                        optimized = simplifiedValue
                        compiledFn = this.compile(simplifiedValue)
                    }
                } else if (primitive === 'isUndefined' && resolved(optimized[1])) {
                    optimized = optimized[1] === undefined
                    compiledFn = this.compile(optimized)
                }
            }
        }

        this.registry.setDetail(sExpr, 'compiled', compiledFn)
        this.registry.setDetail(sExpr, 'optimized', optimized)

        return [compiledFn, optimized]
    }

    canBeSimplified(sExpr) {
        const exprAsString = exprToString(sExpr)
        if (resolved(sExpr)) {
            return true
        }

        const fromCache = this.registry.getDetail(sExpr, 'canBeSimplified')
        if (fromCache !== undefined) {
            return fromCache
        }
    
        const [ primitive, ...args ] = sExpr
        const result = primitive === 'arg' || primitive === 'isUndefined' || primitive === 'call' || primitive === 'fnref'
            ? false
            : args.every(a => this.canBeSimplified(a))

        this.registry.setDetail(sExpr, 'canBeSimplified', result)

        return result
    }
}

function resolved(sExpr) {
    return !Array.isArray(sExpr) || (sExpr[0] === 'error' && resolved(sExpr[1]))
}