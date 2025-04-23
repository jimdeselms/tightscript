import { COMPILE_HANDLERS } from './primitives/COMPILE_HANDLERS'
import { exprToString } from '../parse'
import { Registry } from '../Registry'
import { expandSafeOperator } from './primitives/expandSafeOperator'

const DEBUG = false

export class OptimizingCompiler {
    constructor() {
        this.state = {
            fns: [],
            fnExpressions: [],
            knownConditions: new Map()
        }

        this.compileHandlers = COMPILE_HANDLERS(this.state, this.compile.bind(this))
        this.registry = new Registry()
    }

    declareFunction(ordinal, body) {
        this.state.fns[ordinal] = this.compile(['fn', body])()
        this.state.fnExpressions[ordinal] = this.optimize(['fn', body]).optimizedExpr
    }

    optimize(sExpr) {
        const [ _, optimized ] = this.compileImpl(sExpr)
        return {
            ordinalFunctions: this.state.fnExpressions, 
            optimizedExpr: optimized
        }
    }

    compile(sExpr) {
        const [ fn ] = this.compileImpl(sExpr)
        return fn
    }

    compileImpl(sExpr) {
        let optimized
        let compiledFn

        if (Array.isArray(sExpr) && sExpr[0] === 'if') {
            const args = sExpr.slice(1);
            // Try to optimize the if first, because we may find that one of the branches can be pruned, in which case we can
            // avoid it.
            [ compiledFn, optimized ] = this.applyIfOptimizations(args)

            // We can't compute the sha of the unoptimized expression, because that will cause the lazy branches to be evaluated,
            // so we'll just pretend that this is the original.
            sExpr = optimized
        } else {
            optimized = this.registry.getDetail(sExpr, "optimized")
            compiledFn = this.registry.getDetail(sExpr, "compiled")

            if (compiledFn) {
                // If it has an optimized value, then we'll get that instead.
                return [ compiledFn, optimized ]
            } else if (resolved(sExpr)) {
                optimized = sExpr
                compiledFn = () => sExpr
            } else {
                let [primitive, ...args] = sExpr

                // If it's an if -- and the condition can be inferred statically -- then we can lop off 
                // an entire branch of the if statement.
                if (primitive === 'if') {
                    [ compiledFn, optimized ] = this.applyIfOptimizations(args)
                } else {
                    [primitive, ...args] = sExpr
                    if (primitive.endsWith("_safe")) {
                        const safe = this.substituteSafeOperators(sExpr)
                        const asString = exprToString(safe)
                        return this.compileImpl(safe)
                    }

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
                    } else {
                        [ compiledFn, optimized ] = this.applyPrimitiveSpecificOptimizations(sExpr, optimized, compiledFn)
                    }
                }
            }
        }

        if (DEBUG) {
            const before = exprToString(sExpr)
            const after = exprToString(optimized)
            if (before !== after && !resolved(optimized)) {
                console.log("*** " + before)
                console.log("    " + after)
            }
        }

        this.registry.setDetail(sExpr, 'compiled', compiledFn)
        this.registry.setDetail(sExpr, 'optimized', optimized)

        return [compiledFn, optimized]
    }

    applyIfOptimizations(args, compiledFn, optimized) {
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

        return [ compiledFn, optimized ]
    }

    applyPrimitiveSpecificOptimizations(sExpr, optimized, compiledFn) {
        const primitive = sExpr[0]

        switch (primitive) {
            case "isUndefined":
                optimized = this.optimizeIsFn(
                    e => e === undefined, 
                    e => resolved(e), 
                    optimized)
                break
            case "isNumber":
                optimized = this.optimizeIsFn(
                    e => typeof e === 'number', 
                    e => !isError(e) && resolved(e) || e[0] === 'fn' || e[0] === 'fnref', 
                    optimized)
                break

            case "isBoolean":
                optimized = this.optimizeIsFn(
                    e => typeof e === 'boolean', 
                    e => !isError(e) && resolved(e) || e[0] === 'fn' || e[0] === 'fnref', 
                    optimized)
                break
    
            case "isString":
                optimized = this.optimizeIsFn(
                    e => typeof e === 'string', 
                    e => !isError(e) && resolved(e) || e[0] === 'fn' || e[0] === 'fnref', 
                    optimized)
                break

                        case "isFunction":
                optimized = this.optimizeIsFn(
                    e => Array.isArray(e) && (e[0] === 'fn' || e[0] === 'fnref'),
                    e => resolved(e) && !isError(e),
                    optimized)
                break
        }

        if (typeof optimized === "boolean") {
            compiledFn = this.compile(optimized)
        }

        return [compiledFn, optimized]
    }

    optimizeIsFn(isTrueTest, isFalseTest, optimized) {
        if (!Array.isArray(optimized)) {
            return false
        }

        const argument = optimized[1]
        if (isTrueTest(argument)) {
            return true
        } else if (isFalseTest(argument)) {
            return false
        } else {
            // no change
            return optimized
        }
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
        const result = primitive === 'arg' || primitive === 'isUndefined' || primitive === 'call' || primitive === 'fn' || primitive === 'fnref'
            ? false
            : args.every(a => this.canBeSimplified(a))

        this.registry.setDetail(sExpr, 'canBeSimplified', result)

        return result
    }

    substituteSafeOperators(sExpr) {
        let [primitive, ...args] = sExpr

        const basePrim = primitive.slice(0, -5)
        const swapIfNeeded = SWAPPABLE_PRIMITIVES[basePrim]
        if (swapIfNeeded) {
            const [lhs, rhs] = args
            const lhsCost = this.calculateCost(lhs)
            const rhsCost = this.calculateCost(rhs)

            if (lhsCost > rhsCost) {
                // If the left hand side is more expensive, then we'll swap them so that the cheaper one is evaluated first.
                primitive = swapIfNeeded
                args = [rhs, lhs]
            } else {
                primitive = basePrim
            }
        } else {
            primitive = basePrim
        }

        return expandSafeOperator(primitive, args)
    }

    calculateCost(sExpr) {
        const existingCost = this.registry.getDetail(sExpr, 'cost')
        if (existingCost !== undefined) {
            return existingCost
        }
    
        if (resolved(sExpr)) {
            return 1
        }
    
        // A very very simple cost estimate; just see how many nodes there are in the expression.
        const cost = sExpr.slice(1).reduce((acc, arg) => {
            return acc + this.calculateCost(arg)
        }, 1)

        this.registry.setDetail(sExpr, 'cost', cost)

        return cost
    }
}

function resolved(sExpr) {
    return !Array.isArray(sExpr) || (RESOLVED_EXPRESSION_TYPES.has(sExpr[0]) && resolved(sExpr[1]))
}

const RESOLVED_EXPRESSION_TYPES = new Set(["error"])

const isError = (sExpr) => Array.isArray(sExpr) && sExpr[0] === 'error'

// Each of these binary primitives can be swapped, meaning that the more expensive side of the operation can be put first.
// However, this means that we can't really do the 
const SWAPPABLE_PRIMITIVES = {
    add: 'add',
    sub: 'sub_opp',
    mul: 'mul',
    div: 'div_opp',
    mod: 'mod_opp',
    or: 'or',
    and: 'and',
    xor: 'xor',
    lt: 'gt',
    le: 'ge',
    gt: 'lt',
    ge: 'le',
    eq: 'eq',
}