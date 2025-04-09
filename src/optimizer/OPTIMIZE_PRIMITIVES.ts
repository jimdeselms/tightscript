// @ts-nocheck
import { expr } from '../parse'
import { optimize } from './optimize'

const SIMPLE_UNARY = (name) => (state, onOut, arg) => {
    return expr`(${name} ${optimize(arg, state, onOut)})`
}

const SIMPLE_BINARY = (name) => (state, onOut, arg1, arg2) => {
    return expr`(${name} ${optimize(arg1, state, onOut)} ${optimize(arg2, state, onOut)})`
}

export const OPTIMIZE_PRIMITIVES = {
    negate: NUMERIC_UNARY('negateNumber'),
    error: SIMPLE_UNARY('error'),
    negateNumber: SIMPLE_UNARY('negateNumber'),
    add: SIMPLE_BINARY('add'),
    isNumber: SIMPLE_UNARY('isNumber'),
    isError: SIMPLE_UNARY('isError'),
    isUndefined: SIMPLE_UNARY('isUndefined'),
    arg: (state, onOut, arg) => ['arg'],
    fn: (state, onOut, arg) => {
        const newArg = optimize(arg, state, onOut)
        return expr`(fn ${newArg})`
    },
    quote: (state, onOut, arg) => {
        // For a function, we optimize all the parts separately
        const args = []
        const newArgs = Array.isArray(arg)
            ? arg.map(a => optimize(a, state, () => {}))
            : arg

        // We've optimized the args themselves, now we'll optimize the whole thing.
        optimize(arg, state, val => args.push(val))

        onOut(args)

        return ['quote', newArgs]
    },
    unquote: SIMPLE_UNARY('unquote'),
    ifelse: (state, onOut, condition, ifTrue, ifFalse) => {
        const optimizedCondition = optimize(condition, state, onOut)
        const optimizedIfTrue = optimize(ifTrue, state, onOut)
        const optimizedIfFalse = optimize(ifFalse, state, onOut)

        return expr`(ifelse ${optimizedCondition} ${optimizedIfTrue} ${optimizedIfFalse})`
    }
}

function NUMERIC_UNARY(name) {
    return (state, onOut, arg) => {
        return optimize(expr`(ifelse (isUndefined ${arg}) 
            (quote undefined) 
            (quote (ifelse (isError ${arg})
                (quote ${arg}) 
                (quote (ifelse (isNumber ${arg})
                    (quote (${name} ${arg}))
                    (quote (error "not a number"))
                ))
            ))
        )`, state, onOut)
    }
}