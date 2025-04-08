// @ts-nocheck

export const COMPILER_PRIMITIVES = {
    negateNumber: ({ stack }) => stack.push(-stack.pop()),
    isNumber: ({ stack }) => stack.push(typeof stack.pop() === 'number'),
}