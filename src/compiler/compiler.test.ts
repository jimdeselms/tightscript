import { describe, expect, it } from 'vitest'

import { compile, evaluate } from './compiler'

describe('eval', () => {
    it('can evaluate an expression', () => {
        const compiled = evaluate("5")

        expect(compiled).toBe(5)
    })

    it.each([
        ["!undefined", undefined],
        ["!true", false],
        ["!false", true],
        ["-undefined", undefined],
        ["- (5)", -5],
    ])('will check for undefined in unary expressions', (code, expected) => {
        const compiled = evaluate(code)

        expect(compiled).toEqual(expected)
    })

    it.each([
        ["5 + 5", 10],
        ["undefined + 5", undefined],
        ["5 + undefined", undefined],
        ["undefined + 5", undefined],
        ["undefined + undefined", undefined],
        ["2 + 5", 7],
    ])('will check for undefined in binary expressions', (code, expected) => {
        const compiled = evaluate(code)

        expect(compiled).toEqual(expected)
    })

    it.each([
        ["undefined()", undefined],
        ["undefined(1)", undefined],
        ["undefined(1, 2)", undefined],
        ["parseInt('5')", 5],
    ])('will check for undefined in a function call', (code, expected) => {
        const compiled = evaluate(code)

        expect(compiled).toEqual(expected)
    })

    it.todo("if both expressions are same, only check for undefined once")
})