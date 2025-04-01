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
                ${justadd(lhs, rhs)}
                (error "rhs not a number"))
            (error "lhs not a number"))))
`)    

function justadd(x: any, y: any) {
    return x + y
}

export const DISPATCH: Record<string, (...args: SExpression[]) => SExpression> = {
    negate,
    add,
    lt: (lhs: any, rhs: any) => lhs < rhs,
    isUndefined: (lhs: any) => lhs === undefined,
    isNumber: (lhs: any) => typeof lhs === 'number',

    error: (arg) => expr`(error ${arg})`,

    cond: (expr, ifTrue, ifFalse) => expr ? ifTrue : ifFalse
}
