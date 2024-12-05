import { describe, it, expect } from 'vitest'

import { compile } from './compiler'

describe('compile', () => {
    it.each([
        ['5', 5]
    ])('compile %#%', (code, expected) => {
        const compiled = compile(code)

        const fn = eval(compiled)

        const result = fn()

        expect(result).toEqual(expected)
    })
})