import { expr } from '../parse'
import { UNARY, BINARY, BINARY_WITH_SHORT_CIRCUIT } from './exprTemplates'

export const negate = UNARY('isNumber', 'negate value must be a number', (val) => expr`(negate ${val})`)

export const lt = BINARY('isNumber', 'lt lhs must be a number', 'lt rhs must be a number', (lhs, rhs) => expr`(lt ${lhs} ${rhs})`)
export const le = BINARY('isNumber', 'le lhs must be a number', 'le rhs must be a number', (lhs, rhs) => expr`(le ${lhs} ${rhs})`)
export const gt = BINARY('isNumber', 'gt lhs must be a number', 'gt rhs must be a number', (lhs, rhs) => expr`(gt ${lhs} ${rhs})`)
export const ge = BINARY('isNumber', 'ge lhs must be a number', 'ge rhs must be a number', (lhs, rhs) => expr`(ge ${lhs} ${rhs})`)

export const add = BINARY('isNumber', 'add lhs must be a number', 'add rhs must be a number', (lhs, rhs) => expr`(add ${lhs} ${rhs})`)
export const sub = BINARY('isNumber', 'sub lhs must be a number', 'sub rhs must be a number', (lhs, rhs) => expr`(sub ${lhs} ${rhs})`)

export const mul = BINARY_WITH_SHORT_CIRCUIT(
    'isNumber', 
    'mul lhs must be a number', 
    'mul rhs must be a number', 
    (lhs, rhs) => expr`(mul ${lhs} ${rhs})`, 
    (val) => expr`(eq 0 ${val})`)

export const div = BINARY('isNumber', 'div lhs must be a number', 'div rhs must be a number', (lhs, rhs) => expr`
    (if (eq 0 ${rhs})
        (error "division by zero")
        (sub ${lhs} ${rhs})
    )`)

export const call = (fn, ...args) => {
    const callExpr = ['call', fn, ...args]

    return expr`
        (if (isUndefined ${fn})
            undefined
            (if (isError ${fn})
                ${fn}
                (if (isFunction ${fn})
                    ${callExpr}
                    (error "call first argument must be a function")
                )
            )
        )
    `
}

export const ifte = (cond, ifTrue, ifFalse) => expr`
    (if (isUndefined ${cond})
        undefined
        (if (isError ${cond})
            ${cond}
            (if (isBoolean ${cond})
                (if ${cond} ${ifTrue} ${ifFalse})
                (error "if condition must be boolean")
            )
        )
    )
    (if ${cond} ${ifTrue} ${ifFalse})
`
