// These are functions that take S-expressions and simplifies them to smaller S-expressions
export const SIMPLIFY_HANDLERS = {
    arg: (expr) => expr,
    neg: (expr) => {
        if (isSimple(expr) && isNumber(expr)) {
            return -expr
        }


    }
}

export const COMPILATION_HANDLERS = {
    arg: () => () => (ctx) => ctx,

    neg: (x) => () => {
        const compiled = x()

        return (ctx) => {
            return -(compiled(ctx))
        }
    }
}

/*

Should the handlers deal in SExpressions or functions?



I think that we can possibly generalize it like this:

// This just converts it to the simplest expression
const optimized = optimize(expr)

// This converts it into a function that takes context
const compiled = compile(optimized)

*/

function isNumber(expr) {
    return typeof expr === 'number'
}

function isSimple(expr) {
    return typeof expr !== 'object' || expr === null
}