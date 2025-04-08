// @ts-nocheck
import { expr } from './parse'
import { optimize } from './optimize'

const SIMPLE_UNARY = (name) => (state, arg) => {
    return expr`(${name} ${optimize(arg, state)})`
}

const SIMPLE_BINARY = (name) => (state, arg1, arg2) => {
    return expr`(${name} ${optimize(arg1, state)} ${optimize(arg2, state)})`
}

export const OPTIMIZE_PRIMITIVES = {
    negate: SIMPLE_UNARY('negate'),
    add: SIMPLE_BINARY('add'),
    isNumber: SIMPLE_UNARY('isNumber')
}
