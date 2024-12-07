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
        const lazy = fn(null)
        const result = lazy()

        expect(result).toEqual(expected)
    })

    it.each([
        ['$', 1, 1],
        ['$', 5, 5],
        ['$ + 2', 5, 7],
        ['$ * $ * $', 3, 27],
    ])('it can reference the $ argument', (code, arg, expected) => {
        const compiled = compile(code)

        const fn = eval(compiled)

        const lazy = fn(arg)
        const result = lazy()

        expect(result).toEqual(expected)

    })

    it.each([
        ['(x) => 100', null, 100],
        ['(x) => x', 5, 5],
        ['(x) => x+1', 5, 6],
        ['x => x*x', 10, 100],
    ])('can compile function expressions %#%', (code, arg, expected) => {
        const compiled = compile(code)

        const fn = eval(compiled)

        const lazy = fn(arg)
        const resultFn = lazy()
        const resultLazy = resultFn(() => () => arg)
        const result = resultLazy()

        expect(result).toEqual(expected)
    })
})

