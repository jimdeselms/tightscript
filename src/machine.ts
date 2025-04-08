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
        handler(state)
    } else {
        state.stack.push(input)
    }
}
