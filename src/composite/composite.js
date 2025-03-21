import { PRIMITIVES } from './primitives'

export function branch(condition, ifTrue, ifFalse) {
    return [PRIMITIVES.dup, condition, [ifTrue, ifFalse]]
}

export function defer(fn) {
    return [{
        deferred: fn
    }]
}

export function constant(value) {
    return [ (stack) => stack.push(value) ]
}
