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
        ['(x) => 100', null, 100],
        ['(x) => x', 5, 5],
        ['(x) => x+1', 5, 6],
    ])('can compile function expressions %#%', (code, argument, expected) => {
        const compiled = compile(code)

        const fn = eval(compiled)

        let result = fn(argument)

        result = result(argument)

        expect(result).toEqual(expected)
    })
})

