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
    isNumber: SIMPLE_UNARY('isNumber'),
    fn: (state, arg) => {
        // For a function, we optimize all the parts separately
        const newArgs = Array.isArray(arg)
            ? arg.map(a => optimize(a, state))
            : arg

        return ['fn', newArgs]
    },
    apply: (state, fn, arg) => SIMPLE_BINARY('apply'),
    ifelse: (state, condition, ifTrue, ifFalse) => {
        const optimizedCondition = optimize(condition, state)
        const optimizedIfTrue = optimize(ifTrue, state)
        const optimizedIfFalse = optimize(ifFalse, state)

        return expr`(ifelse ${optimizedCondition} ${optimizedIfTrue} ${optimizedIfFalse})`
    }
}
