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

        const lazy = fn([])
        const result = lazy()

        expect(result).toEqual(expected)
    })

    it.each([
        ['(x) => 100', null, 100],
        ['(x) => x', 5, 5],
        ['(x) => x+1', 5, 6],
    ])('can compile function expressions %#%', (code, argument, expected) => {
        const compiled = compile(code)

        const fn = eval(compiled)

        const lazy = fn([])
        const resultFn = lazy()

        const resultLazy = resultFn(() => () => argument)
        const result = resultLazy()

        expect(result).toEqual(expected)
    })
})

