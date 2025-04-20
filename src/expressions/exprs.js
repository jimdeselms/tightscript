import { expr } from '../parse'
import { UNARY, BINARY } from './exprTemplates'

export const negate = UNARY('isNumber', 'negate value must be a number', (val) => expr`(negate ${val})`)
export const add = BINARY('isNumber', 'add lhs must be a number', 'add rhs must be a number', (lhs, rhs) => expr`(add ${lhs} ${rhs})`)
