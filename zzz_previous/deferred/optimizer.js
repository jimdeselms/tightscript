export function compile(expr) {
    const simplified = simplify(expr)

    const compiled = compileSimplified(simplified)

    return compiled
}

// Simplify takes an S-expression and turns it into the optimized version of the S-expression
export function simplify(expr) {
    if (typeof expr !== 'object' || expr === null) {
        return expr
    }

    const [ primitive, ...args ] = expr

    const handler = SIMPLIFY_HANDLERS[primitive]
    if (!handler) {
        throw "Unknown primitive " + primitive
    }

    const simplifiedArgs = args.map((arg) => simplify(arg))

    return handler(...simplifiedArgs)
}

export function compileSimplified(expr) {
    if (typeof expr !== 'object' || expr === null) {
        return () => expr
    }

    const [ primitive, ...args ] = expr

    const handler = COMPILATION_HANDLERS[primitive]
    if (!handler) {
        throw "Unknown primitive " + primitive
    }

    const compiledArgs = args.map((arg) => compile(arg))

    return handler(...compiledArgs)
}

function isSimple(expr) {
    return typeof expr !== 'object' || expr === null
}

function isNumber(expr) {
    return typeof expr === 'number'
}

const ARG = ['arg']

// These are functions that take S-expressions and simplifies them to smaller S-expressions
export const SIMPLIFY_HANDLERS = {
    arg: () => ARG,

    neg: (arg) => {
        if (isSimple(arg) && isNumber(arg)) {
            return -arg
        }

        return ['neg', arg]
    },

    sub: (lhs, rhs) => {
        // These should return errors if the args aren't numbers
        if (isSimple(lhs) && isSimple(rhs) && isNumber(lhs) && isNumber(rhs)) {
            return lhs - rhs
        }

        return ['sub', lhs, rhs]
    }
}


export const COMPILATION_HANDLERS = {
    arg: () => (ctx) => ctx,

    neg: (arg) => {
        return (ctx) => {
            return -(arg(ctx))
        }
    },

    sub: (lhs, rhs) => {
        return (ctx) => {
            return lhs(ctx) - rhs(ctx)
        }
    }
}
