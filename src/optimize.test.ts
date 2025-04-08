import { describe, it, expect } from 'vitest';
import { optimize } from './optimize'
import { expr } from './parse'

describe('optimize', () => {
    it('can do stuff', () => {
        const e = expr`10`
        const result = optimize(e, {})
        expect(result).toEqual(10)
    })

    it('can negate a number', () => {
        const e = expr`(negate 10)`
        const result = optimize(e, {})
        expect(result).toEqual(expr`(negate 10)`)
    })

    it('can handle a deferred sub-expression', () => {
        const e = ['negate', () => 100]
        const result = optimize(e, {})
        expect(result).toEqual(expr`(negate 100)`)
    })
})