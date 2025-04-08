// @ts-nocheck
import { optimize } from './optimize'
import { expr } from './parse'
import { machine } from './machine'

export function evaluate(sExpression) {
    const state = {}
    const optimized = optimize(sExpression, state)
    const postfixed = Array.from(postfix(optimized))
    
    const machineState = { input: postfixed, stack: [] }

    while (machineState.input.length > 0) {
        machine(machineState)
    }

    return machineState.stack[0]
}

function* postfix(sExpression) {
    if (Array.isArray(sExpression)) {
        for (const item of sExpression.reverse()) {
            yield* postfix(item)
        }
    } else {
        yield sExpression
    }
}
