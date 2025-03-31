import { describe, it, expect } from 'vitest'

import { evaluate } from './fns'
import { expr, parse, parseSExpression } from './parse'

describe('run', () => {
    it('can write out a number', () => {
        const result = evaluate(['negate', 20])

        expect(result).toEqual(-20)
    })

    it('can add two numbers', () => {
        const result = evaluate(['add', 2, 3])

        expect(result).toEqual(5)
    })

    it('can create an error object', () => {
        const result = evaluate(['error', 'this is an error'])

        expect(result).toEqual(['error', 'this is an error'])
    })

    it('can handle a conditional expression', () => {
        const result = evaluate(['cond', ['lt', 10, 20], 1, 2])
        expect(result).toEqual(1)
    })

    it('will return an error if you negate a thing that is not a number', () => {
        const result = evaluate(['negate', 'hello'])

        // The result should be an error expression
        expect(result).toEqual(['error', 'not a number'])
    })

    it('can parse', () => {
        expect(parse('(negate (add 2 3))')).toEqual(['negate', ['add', 2, 3]])
    })

    it('can parse an expr with arguments', () => {
        const e = expr`(negate ${1} 2)`
        expect(e).toEqual(['negate', 1, 2])
    })

    it('can handle a deferred value', () => {
        const e = evaluate(['negate', () => 20])
        expect(e).toEqual(-20)
    })
})
