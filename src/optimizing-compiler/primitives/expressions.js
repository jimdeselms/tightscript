import { expr } from '../../parse.js'
import { UNARY, BINARY, BINARY_WITH_SHORT_CIRCUIT } from './exprTemplates.js'

export const negate = UNARY('isNumber', 'negate value must be a number', (val) => expr`(negate ${val})`)

export const lt = BINARY('isNumber', 'lt lhs must be a number', 'lt rhs must be a number', (lhs, rhs) => expr`(lt ${lhs} ${rhs})`)
export const lt_opp = BINARY('isNumber', 'lt rhs must be a number', 'lt lhs must be a number', (lhs, rhs) => expr`(lt_opp ${lhs} ${rhs})`)

export const le = BINARY('isNumber', 'le lhs must be a number', 'le rhs must be a number', (lhs, rhs) => expr`(le ${lhs} ${rhs})`)
export const le_opp = BINARY('isNumber', 'le rhs must be a number', 'le lhs must be a number', (lhs, rhs) => expr`(le_opp ${lhs} ${rhs})`)

export const gt = BINARY('isNumber', 'gt lhs must be a number', 'gt rhs must be a number', (lhs, rhs) => expr`(gt ${lhs} ${rhs})`)
export const gt_opp = BINARY('isNumber', 'gt rhs must be a number', 'gt lhs must be a number', (lhs, rhs) => expr`(gt_opp ${lhs} ${rhs})`)

export const ge = BINARY('isNumber', 'ge lhs must be a number', 'ge rhs must be a number', (lhs, rhs) => expr`(ge ${lhs} ${rhs})`)
export const ge_opp = BINARY('isNumber', 'ge rhs must be a number', 'ge lhs must be a number', (lhs, rhs) => expr`(ge_opp ${lhs} ${rhs})`)

export const add = BINARY('isNumber', 'add lhs must be a number', 'add rhs must be a number', (lhs, rhs) => expr`(add ${lhs} ${rhs})`)

export const sub = BINARY('isNumber', 'sub lhs must be a number', 'sub rhs must be a number', (lhs, rhs) => expr`(sub ${lhs} ${rhs})`)
export const sub_opp = BINARY('isNumber', 'sub rhs must be a number', 'sub lhs must be a number', (lhs, rhs) => expr`(sub_opp ${lhs} ${rhs})`)

export const mul = BINARY_WITH_SHORT_CIRCUIT(
    'isNumber', 
    'mul lhs must be a number', 
    'mul rhs must be a number', 
    (lhs, rhs) => expr`(mul ${lhs} ${rhs})`, 
    (val) => expr`(eq 0 ${val})`)

export const div = BINARY('isNumber', 'div lhs must be a number', 'div rhs must be a number', (lhs, rhs) => expr`
    (if (eq 0 ${rhs})
        (error "division by zero")
        (div ${lhs} ${rhs})
    )`)

export const div_opp = BINARY('isNumber', 'div rhs must be a number', 'div lhs must be a number', (lhs, rhs) => expr`
    (if (eq 0 ${lhs})
        (error "division by zero")
        (div_opp ${lhs} ${rhs})
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
                    (error "call target must be a function")
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
