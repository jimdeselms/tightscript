import { DISPATCH } from "./DISPATCH"
import { expr } from "./parse"

export type SimpleToken = string | number | boolean | null | undefined
export type SExpression = SimpleToken | LazySExpression | [string, ...SExpression[]]
export type LazySExpression = () => SExpression

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

