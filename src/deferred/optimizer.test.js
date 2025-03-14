import { compile } from './optimizer'

import { it, describe, expect } from 'vitest'

describe('optimizer', () => {
    it('constant expression', () => {
        const compiled = compile(5)
        expect(compiled(null)).toEqual(5)
    })

    it('unary with constant', () => {
        const compiled = compile(['neg', 5])
        expect(compiled(null)).toEqual(-5)
    })

    it('unary with nested', () => {
        const compiled = compile(['neg', ['neg', 10]])
        expect(compiled(null)).toEqual(10)
    })

    it('unary with arg', () => {
        const compiled = compile(['neg', ['arg']])
        expect(compiled(10)).toEqual(-10)
    })

    it('sub with constants', () => {
        const compiled = compile(['sub', 10, 2])
        expect(compiled(null)).toEqual(8)
    })

    it('sub with args 1', () => {
        let compiled

        compiled = compile(['sub', ['arg'], 2])
        expect(compiled(5)).toEqual(3)

        compiled = compile(['sub', 10, ['arg']])
        expect(compiled(3)).toEqual(7)
    })

})