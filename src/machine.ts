// @ts-nocheck

import { MACHINE_PRIMITIVES } from './MACHINE_PRIMITIVES'

export function machine(state) {
    if (state.input.length === 0) {
        // If there's no input, there's nothing to do
        return
    }

    const input = state.input.shift()

    if (typeof input === 'string' && !input.startsWith('"')) {
        // If it's a string, we need to call the corresponding primitive
        const handler = MACHINE_PRIMITIVES[input]
        if (!handler) {
            throw new Error(`Unknown machine primitive: ${input}`)
        }
        handler(state)
    } else if (Array.isArray(input)) {
        // If it's an array, we need to push it onto the stack
        // If we call "apply" after that, then the list will be expanded.
        state.stack.push(input)
    } else {
        state.stack.push(input)
    }
}
