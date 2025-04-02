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
        const nextInputs = state.stack.pop()
            ? input[0]
            : input[1]

        for (const nextInput of nextInputs) {
            runMachine(nextInput, output, state)
        }

    } else {
        state.stack.push(input)
    }
}
