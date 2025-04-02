import { DISPATCH } from "./DISPATCH"

export type SimpleToken = string | number | boolean | null | undefined
export type SExpression = SimpleToken | LazySExpression | [string, ...SExpression[]]
export type LazySExpression = () => SExpression

/**
 * It's turtles all the way down.
 * 
 * When we evaluate an S-expression, we emit the thing if it's a simple token, or we expand if it's a lazy function.
 * 
 * And if it's an array, we assume that the first element is the name of a primitive function, and the result of the 
 * arguments are evaluated and passed to that function.
 * 
 * What does "evaluate" mean? It's whatever the inidividual primitive functions say it means.
 */
export function evaluate(expr: SExpression): SExpression {
    if (Array.isArray(expr)) {
        const [primitive, ...args] = expr

        const mapped = args.map((a: any) => evaluate(a))

        const fn = DISPATCH[primitive]
        if (!fn) { throw "Primitive not found: " + primitive }

        return fn(...mapped)
    } else if (typeof expr === 'function') {
        return evaluate(expr())
    } else {
        return expr
    }
}

