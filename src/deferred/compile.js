export function simplify(expr) {
    if (isSimple(expr)) {
        return expr
    }

    const simplifiedElements = expr.map(e => simplify(e))

    const [ primitive, ...args ] = simplifiedElements

    const handler = HANDLERS[primitive]
    if (!handler) {
        throw new Error(`Unknown primitive: ${primitive}`)
    }

    const result = handler(simplifiedElements)

    if (result === simplifiedElements) {
        // If the handler returns the same input, then the expression can't be simplified further.
        return result
    } else {
        return simplify(result)
    }
}

const HANDLERS = {
    negate: numericUnary((num) => -num),
    
    not: booleanUnary((val) => !val),

    add: binary((lhs, rhs) => lhs + rhs),

    // These expressions can't be simplified further
    error: (expr) => expr,
    arg: (expr) => expr,
}

function numericUnary(fn) {
    return unary(x => typeof x === 'number', 'not a number', fn)
}

function booleanUnary(fn) {
    return unary(x => typeof x === 'boolean', 'not a boolean', fn)
}

function unary(checkValid, errorIfNotValid, ifValid) {
    return (expr) => {
        const num = expr[1]
        if (isUndefinedOrError(num)) {
            return num
        }

        if (!isSimple(num)) {
            return expr
        }

        if (!checkValid(num)) {
            return error(errorIfNotValid)
        }

        return ifValid(num)
    }
}

function binary(ifValid) {
    return (expr) => {
        const lhs = expr[1]
        const rhs = expr[2]
        if (isUndefinedOrError(lhs)) {
            return lhs
        }
        if (isUndefinedOrError(rhs)) {
            return rhs
        }

        if (!isSimple(lhs) || !isSimple(rhs)) {
            return expr
        }

        if (!isNumber(lhs) || !isNumber(rhs)) {
            return error('not a number')
        }

        return ifValid(lhs, rhs)
    }
}

function isUndefinedOrError(expr) {
    return expr === undefined || (Array.isArray(expr) && expr[0] === 'error')    
}

function add(lhs, rhs) {
    if (isSimple(lhs)) {
        if (isNumber(lhs)) {
            if (isSimple(rhs)) {
                if (isNumber(rhs)) {
                    return lhs + rhs
                } else {
                    return error('rhs not a number')
                }
            } else {
                return ['add', lhs, rhs]
            }
        } else {
            return error('lhs not a number')
        }
    } else {
        return ['add', lhs, rhs]
    }
}

function isSimple(expr) {
    return typeof expr !== 'object' || expr === null
}

function isNumber(expr) {
    return isSimple(expr) && typeof expr === 'number'
}

function error(payload) {
    return [ 'error', payload ]
}


/**
 * What would negate look like?
 * 
 * Right, everything should basically boil down to primitives, 
 */