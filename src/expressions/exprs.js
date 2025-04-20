import { expr } from '../parse'
import { UNARY, BINARY } from './exprTemplates'

export const negate = UNARY('isNumber', 'negate value must be a number', (val) => expr`(negate ${val})`)

export const add = BINARY('isNumber', 'add lhs must be a number', 'add rhs must be a number', (lhs, rhs) => expr`(add ${lhs} ${rhs})`)
export const sub = BINARY('isNumber', 'sub lhs must be a number', 'sub rhs must be a number', (lhs, rhs) => expr`(sub ${lhs} ${rhs})`)

export const div = BINARY('isNumber', 'div lhs must be a number', 'div rhs must be a number', (lhs, rhs) => expr`
    (if (eq 0 ${rhs})
        (error "division by zero")
        (sub ${lhs} ${rhs})
    )`)
