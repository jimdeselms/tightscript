import { test, describe, it, expect } from 'vitest'
import { simplify } from './compile'

describe('compileSExpression', () => {
    it('simple expression', () => {
        const result = simplify(5)
        expect(result).toBe(5)
    })

    it('unary expression', () => {
        const result = simplify(['negate', 5])
        expect(result).toBe(-5)
    })

    it('nested unary expression', () => {
        const result = simplify(['negate', ['negate', 5]])
        expect(result).toBe(5)
    })

    it('add', () => {
        const result = simplify(['add', 100, 200])
        expect(result).toBe(300)
    })

    it('nested binary', () => {
        const result = simplify(['add', ['add', 100, 200], 300])
        expect(result).toBe(600)
    })

    it('will not expand an arg', () => {
        const result = simplify(['arg'])
        expect(result).toEqual(['arg'])
    })

    it('will partially simplify an expression with arg', () => {
        const result = simplify(['add', ['arg'], ['add', 100, 200]])
        expect(result).toEqual(['add', ['arg'], 300])
    })
})