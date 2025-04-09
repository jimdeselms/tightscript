// @ts-nocheck
import { describe, it, expect } from 'vitest';
import { optimize } from './optimize'
import { expr } from './parse'

describe('optimize', () => {
    it('can do stuff', () => {
        const e = expr`10`
        let result
        optimize(e, {}, x => { result = x })
        expect(result).toEqual(10)
    })

    it('can negate a number', () => {
        const e = expr`(negate 10)`
        let result = []
        optimize(e, {}, x => { result.push(x) })
        expect(result).toEqual([10, 'negate'])
    })

    it('can handle a deferred sub-expression', () => {
        const e = ['negate', () => 100]
        let result = []
        optimize(e, {}, x => { result.push(x) })
        expect(result).toEqual([100, 'negate'])
    })
})