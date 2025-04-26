import { toExpr } from './parseExpression.js'

export function compileToFunction(expr) {
    if (expr.needsArgs()) {
        while (expr.canAdvance()) {
            expr = expr.advance()
        }
    }

    expr = optimize(expr)

    // If it's an error or undefined, we need to detect it
    if (expr.mayBeUndefined() || expr.mayBeError()) {
        return (...args) => {
            args = args.map(toExpr)
            try {
                return externalize(expr.evaluate(args))
            } catch (e) {
                if (e === "UNDEFINED") {
                    return undefined
                } else {
                    throw e
                }
            }
        }
    } else {
        return (...args) => {
            args = args?.map(toExpr)
            return externalize(expr.evaluate(args))
        }
    }
}

function externalize(value) {
    // Functions internally take expression objects, so we need to convert the real-world arguments to expressions.
    if (typeof value === 'function') {
        return (...args) => {
            return value(...args.map(toExpr))
        }
    } else {
        return value
    }
}

function optimize(expr) {
    if (!Array.isArray(expr)) {
        return expr
    }

    const primitive = expr.primitive
    const args = expr.args.map(a => optimize(a))
    const optimized = toExpr([primitive, ...args])

    if (args.length === 2 && primitive in SWAPPABLE) {
        const [lhs, rhs] = args
        if (lhs.mayBeUndefined()) {
            if (rhs.mayBeUndefined()) {
                if (lhs.cost() > rhs.cost()) {
                    return swap()
                } else {
                    return optimized
                }
            } else {
                return optimized
            }
        } else if (rhs.mayBeUndefined()) {
            return swap()
        } else {
            if (lhs.cost() > rhs.cost()) {
                return swap()
            } else {
                return optimized
            }
        }
    } else {
        return optimized
    }
}

function swap(primitive, lhs, rhs) {
    return toExpr([SWAPPABLE[primitive], rhs, lhs])
}


const SWAPPABLE = {
    add: 'add',
    sub: 'sub_opp',
    mul: 'mul',
    div: 'div_opp',
    mod: 'mod_opp',
    pow: 'pow_opp',
    eq: 'eq',
    neq: 'neq',
    lt: 'gt',
    lte: 'gte',
    gt: 'lt',
    gte: 'lte'
}

