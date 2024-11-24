import { describe, expect, it } from 'vitest'

import { compile, evaluate } from './compiler'

describe('eval', () => {
    it('can evaluate an expression', () => {
        const compiled = evaluate("5")

        expect(compiled).toBe(5)
    })

    it.each([
        ["!undefined", "undefinend"],
        ["!true", "false"],
        ["!false", "true"],
        ["-undefined", "undefined"],
        ["-5", "5"],
    ])('will check for undefined in unary expressions', (code, result) => {
        const compiled = evaluate("!undefined")

        expect(compiled).toBeUndefined()
    })
})