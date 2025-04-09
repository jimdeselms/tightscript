// @ts-nocheck
import { optimize } from './optimize'
import { expr } from './parse'
import { machine } from './machine'
import { toStream } from './toStream'

export function evaluate(sExpression) {
    const state = {}
    const symbols = []
    
    optimize(sExpression, state, (sym) => symbols.push(sym))
//    const postfixed = Array.from(toStream(optimized))
    
    const machineState = { input: symbols, stack: [] }

    while (machineState.input.length > 0) {
        machine(machineState)
    }

    return machineState.stack[0]
}
