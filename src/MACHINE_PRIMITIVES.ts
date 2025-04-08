// @ts-nocheck

export const MACHINE_PRIMITIVES = {
    negate: ({ stack }) => stack.push(-stack.pop()),
    add: ({ stack }) => stack.push(stack.pop() + stack.pop()),
    isNumber: ({ stack }) => stack.push(typeof stack.pop() === 'number'),
}
