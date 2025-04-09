// @ts-nocheck
import { optimize } from './optimizer/optimize'
import { expr } from './parse'
import { machine } from './machine/machine'

export function evaluate(sExpression) {
    const state = {}
    const symbols = []
    
    optimize(sExpression, state, (sym) => symbols.push(sym))
    
    const machineState = { 
        input: symbols, 
        stack: [],
        argStack: [],
    }

    while (machineState.input.length > 0) {
        machine(machineState)
    }

    return machineState.stack[0]
}
