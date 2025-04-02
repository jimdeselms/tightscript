import { PrimitiveFn } from ".";

export const PRIMITIVES: Record<string, PrimitiveFn> = {
    emit: (state, output) => {
        output(state.stack.pop())
    },

    negateNumber: (state) => {
        state.stack.push(-state.stack.pop())
    },

    isNumber: (state) => {
        state.stack.push(typeof state.stack.pop() === 'number')
    },

    dup: (state) => {
        state.stack.push(state.stack[state.stack.length - 1])
    },

    drop: (state) => {
        state.stack.pop()
    },
}