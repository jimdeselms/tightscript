import { evaluate, SExpression } from "./fns"
import { expr } from "./parse"

const negate = (lhs: any) => evaluate(expr`(cond (isUndefined ${lhs}) 
    undefined
    (cond (isNumber ${lhs})
        ${-lhs}
        (error "not a number")))
`)

const add = (lhs: any, rhs: any) => evaluate(expr`(cond (isUndefined ${lhs})
    undefined
    (cond (isUndefined ${rhs})
        undefined
        (cond (isNumber ${lhs})
            (cond (isNumber ${rhs})
                ${lhs + rhs}
                (error "rhs not a number"))
            (error "lhs not a number"))))
`)    

export const DISPATCH: Record<string, (...args: SExpression[]) => SExpression> = {
    negate,
    add,
    lt: (lhs: any, rhs: any) => lhs < rhs,
    isUndefined: (lhs: any) => lhs === undefined,
    isNumber: (lhs: any) => lhs === undefined ? undefined : typeof lhs === 'number',
    isError: (val: any) => val === undefined ? undefined : Array.isArray(val) && val[0] === 'error',
    isZero: (lhs: any) => lhs === 0,

    error: (arg) => expr`(error ${arg})`,

    cond: (expr, ifTrue, ifFalse) => expr ? ifTrue : ifFalse
}
