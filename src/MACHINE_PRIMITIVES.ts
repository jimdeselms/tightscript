// @ts-nocheck

export const MACHINE_PRIMITIVES = {
    negate: ({ stack }) => stack.push(-stack.pop()),
    add: ({ stack }) => stack.push(stack.pop() + stack.pop()),
    isNumber: ({ stack }) => stack.push(typeof stack.pop() === 'number'),
    apply: (state) => {
        const fn = state.stack.pop()
        state.input.unshift(...fn)
    },
    ifelse: (state) => {
        const { stack } = state
        const condition = stack.pop()
        const ifTrue = stack.pop()
        const ifFalse = stack.pop()

        if (condition) {
            state.input.unshift(...ifTrue)
        } else {
            state.input.unshift(...ifFalse)
        }
    }
}

function asArray(expr) {
    return Array.isArray(expr) ? expr : [expr]
}