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

    it('binary unary expression', () => {
        const result = simplify(['not', true])
        expect(result).toBe(false)
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

    it('can do a conditional', () => {
        expect(simplify(['conditional', true, 100, 200])).toBe(100)
        expect(simplify(['conditional', false, 100, 200])).toBe(200)

        expect(simplify(['conditional', true, 100, undefined])).toBe(100)
        expect(simplify(['conditional', false, undefined, 200])).toBe(200)

        expect(simplify(['conditional', true, 100, ['error', 'foo']])).toBe(100)
        expect(simplify(['conditional', false, ['error', 'foo'], 200])).toBe(200)
    })
})