import { describe, it, expect } from 'vitest'

import { compile } from './compiler'

describe('compile', () => {
    it.each([
        ['5', 5],
        ['5 + 2', 7],
        ['true || false', true],
        ['true && true || true && true || true && true', true],
    ])('compile %#%', (code, expected) => {
        const compiled = compile(code)

        const fn = eval(compiled)

        const result = fn()

        expect(result).toEqual(expected)
    })
})

