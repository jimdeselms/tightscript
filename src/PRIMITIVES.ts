import { PrimitiveFn } from ".";
import { runMachine } from "./runMachine";

export const PRIMITIVES: Record<string, PrimitiveFn> = {
    emit: (state, output) => {
        output(state.stack.pop())
    },

    negateNumber: (state) => {
        state.stack.push(-state.stack.pop())
    },

    addNumbers: (state) => {
        state.stack.push(state.stack.pop() + state.stack.pop())
    },

    isNumber: (state) => {
        state.stack.push(typeof state.stack.pop() === 'number')
    },

    isUndefined: (state) => {
        state.stack.push(typeof state.stack.pop() === 'undefined')
    },

    dup: (state) => {
        state.stack.push(state.stack[state.stack.length - 1])
    },

    drop: (state) => {
        state.stack.pop()
    },

    error: (state) => {
        state.stack.push(new Error(state.stack.pop()))
    },

    eval: (state, output) => {
        const instructions = state.stack.pop()
        instructions.forEach((i: any) => {
            runMachine(i, output, state)
        })
    },

    cond: (state, output) => {
        const ifFalse = state.stack.pop()
        const ifTrue = state.stack.pop()
        const value = state.stack.pop()

        if (value) {
            ifTrue.forEach((i: any) => runMachine(i, output, state))
        } else {
            ifFalse.forEach((i: any) => runMachine(i, output, state))
        }
    }
}