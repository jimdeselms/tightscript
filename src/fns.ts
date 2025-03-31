import { expr } from "./parse"

export type SimpleToken = string | number | boolean | null | undefined
export type SExpression = SimpleToken | LazySExpression | [string, ...SExpression[]]
export type LazySExpression = () => SExpression

export const DISPATCH: Record<string, (...args: SExpression[]) => SExpression> = {
    negate: (lhs: any) => evaluate(expr`(cond (isNumber ${lhs}) ${-lhs}, (error "not a number"))`),
    add: (lhs: any, rhs: any) => lhs + rhs,
    lt: (lhs: any, rhs: any) => lhs < rhs,
    isUndefined: (lhs: any) => lhs === undefined,
    isNumber: (lhs: any) => typeof lhs === 'number',

    error: (arg) => expr`(error ${arg})`,

    cond: (expr, ifTrue, ifFalse) => expr ? ifTrue : ifFalse
}

export function evaluate(expr: SExpression): SExpression {
    if (Array.isArray(expr)) {
        const [primitive, ...args] = expr

        const mapped = args.map((a: any) => evaluate(a))

        return DISPATCH[primitive](...mapped)
    } else if (typeof expr === 'function') {
        return evaluate(expr())
    } else {
        return expr
    }
}
