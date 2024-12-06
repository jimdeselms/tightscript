import { describe, it, expect } from 'vitest'

import { compile } from './compiler'

describe('compile', () => {
    it.each([
        ['5', 5],
        ['5 + 2', 7],
        ['true || false', true],
        ['true && true || true && true || true && true', true],
    ])('can compile non-function expressions %#%', (code, expected) => {
        const compiled = compile(code)

        const fn = eval(compiled)

        const result = fn()

        expect(result).toEqual(expected)
    })

    it.each([
        ['(x) => x', "hello", "hello"],
    ])('can compile function expressions %#%', (code, argument, expected) => {
        const compiled = compile(code)

        const fn = eval(compiled)

        const resultFn = fn()

        const result = resultFn(argument)

        expect(result).toEqual(expected)
    })
})

