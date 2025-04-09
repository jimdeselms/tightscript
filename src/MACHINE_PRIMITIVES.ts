// @ts-nocheck

export const MACHINE_PRIMITIVES = {
    negateNumber: ({ stack }) => stack.push(-stack.pop()),
    add: ({ stack }) => stack.push(stack.pop() + stack.pop()),
    isNumber: ({ stack }) => stack.push(typeof stack.pop() === 'number'),
    isUndefined: ({ stack }) => stack.push(stack.pop() === undefined),
    expand: (state) => {
        const fn = state.stack.pop()
        state.input.unshift(...fn)
    },
    ifelse: (state) => {
        const { stack } = state
        const ifFalse = stack.pop()
        const ifTrue = stack.pop()
        const condition = stack.pop()

        if (condition) {
            state.input.unshift(...ifTrue)
        } else {
            state.input.unshift(...ifFalse)
        }
    },
    fn: () => {}
}

function asArray(expr) {
    return Array.isArray(expr) ? expr : [expr]
}