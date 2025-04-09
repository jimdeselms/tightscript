// @ts-nocheck
import { describe, it, expect } from 'vitest';
import { optimize } from './optimize'
import { expr } from '../parse'

describe('optimize', () => {
    it('can do stuff', () => {
        const e = expr`10`
        let result
        optimize(e, {}, x => { result = x })
        expect(result).toEqual(10)
    })

    it('can negate a number', () => {
        const e = expr`(negateNumber 10)`
        let result = []
        optimize(e, {}, x => { result.push(x) })
        expect(result).toEqual([10, 'negateNumber'])
    })

    it('can handle a deferred sub-expression', () => {
        const e = ['negateNumber', () => 100]
        let result = []
        optimize(e, {}, x => { result.push(x) })
        expect(result).toEqual([100, 'negateNumber'])
    })
})