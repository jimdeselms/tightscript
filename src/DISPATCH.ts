import { evaluate, SExpression } from "./fns"
import { expr } from "./parse"

const mul = (lhs: any, rhs: any) => evaluate(expr`(cond (isZero ${lhs})
    0
    (cond (isZero ${rhs})
        0
        (cond (isUndefined ${lhs})
            undefined
            (cond (isUndefined ${rhs})
                undefined
                (cond (isNumber ${lhs})
                    (cond (isNumber ${rhs})
                        (mulNumbers ${lhs} ${rhs})
                        (error "rhs not a number"))
                    (error "lhs not a number"))))))
`)

const binary = (typePrimitive: string, primitive: string) => (lhs: any, rhs: any) => evaluate(expr`
    (cond (isUndefined ${lhs})
    undefined
    (cond (isUndefined ${rhs})
        undefined
        (cond (${typePrimitive} ${lhs})
            (cond (${typePrimitive} ${rhs})
                (${primitive} ${lhs} ${rhs})
                (error "rhs not a number"))
            (error "lhs not a number"))))
`)

const unary = (typePrimitive: string, primitive: string) => (arg: any) => evaluate(expr`
    (cond (isUndefined ${arg}) 
        undefined
        (cond (${typePrimitive} ${arg})
            (${primitive} ${arg})
            (error "not a number")))`
)

export const DISPATCH: Record<string, (...args: SExpression[]) => SExpression> = {
    negate: unary('isNumber', 'negateNumber'),
    add: binary('isNumber', 'addNumbers'),
    mul,
    lt: (lhs: any, rhs: any) => lhs < rhs,
    isUndefined: (lhs: any) => lhs === undefined,
    isNumber: (lhs: any) => lhs === undefined ? undefined : typeof lhs === 'number',
    isError: (val: any) => val === undefined ? undefined : Array.isArray(val) && val[0] === 'error',
    isZero: (val: any) => val === undefined ? undefined : val === 0,

    error: (arg) => expr`(error ${arg})`,

    cond: (expr, ifTrue, ifFalse) => expr ? ifTrue : ifFalse,

    addNumbers: (lhs: any, rhs: any) => lhs + rhs,
    mulNumbers: (lhs: any, rhs: any) => lhs * rhs,
    negateNumber: (arg: any) => -arg,
}
