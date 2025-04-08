// @ts-nocheck

import { COMPILER_PRIMITIVES } from "./COMPILER_PRIMITIVES"

export function compile(instructions) {

    const fns = []

    for (const instruction of instructions) {
        if (typeof instruction === 'string') {
            if (instruction.startsWith('"')) {
                // It's a string; just return it as is.
                fns.push((state) => state.stack.push(instruction.slice(1, -1)))
            } else {
                fns.push(COMPILER_PRIMITIVES[instruction])
            }
        } else {
            fns.push((state) => state.stack.push(instruction))
        }
    }

    return () => {
        const state = { stack: [] }
        for (const fn of fns) {
            fn(state)
        }
        return state.stack[0]
    }
}