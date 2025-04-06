import { InputSymbol, OutputCallback } from ".";
import { BUILTINS } from "./BUILTINS";
import { PRIMITIVES } from './PRIMITIVES';

export function runMachine(input: InputSymbol, output: OutputCallback, state: any): void {
    if (typeof input === 'string') {
        if (input[0] === '"' && input[input.length - 1] === '"') {
            state.stack.push(input.slice(1, -1))
        } else {
            const nextSymbols = BUILTINS[input]
            if (nextSymbols) {
                for (const nextSymbol of nextSymbols) {
                    runMachine(nextSymbol, output, state)
                }
            } else {
                const primitive = PRIMITIVES[input]
                if (primitive) {
                    primitive(state, output)
                } else {
                    throw new Error(`Unknown primitive: ${input}`)
                }
            }
        }
    } else if (Array.isArray(input)) {
        if (input.length === 1) {
            // It's a block; just push it onto the stack as is.
            state.stack.push(input[0])
        }

    } else {
        state.stack.push(input)
    }
}

export function createMachine(output: OutputCallback): (input: InputSymbol) => void {
    const state = { stack: [] }
    return (input: InputSymbol) => {
        runMachine(input, output, state)
    }
}