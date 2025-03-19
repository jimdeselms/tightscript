import { describe, it, expect, beforeEach } from 'vitest'

import { Optimizer } from './optimizer'
import { Registry } from './registry'

describe('optimizer', () => {
    let optimizer: Optimizer

    beforeEach(() => {
        const registry = new Registry()
        optimizer = new Optimizer(registry)
    })

    it('can optimize a number S-expression', () => {
        const result = optimizer.process(3)
        expect(result.sExpression).toBe(3)
    })

    it('can optimize a string S-expression', () => {
        const result = optimizer.process('hello')
        expect(result.sExpression).toBe('hello')
    })

    it('can handle a simple primitive that works on a scalar', () => {
        const result = optimizer.process(['negate', 5])
        expect(result.sExpression).toBe(-5)
    })
})