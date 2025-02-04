import { describe, it, expect } from 'vitest'

import { evaluateSExpression } from "./evaluateSExpression";
import { EVALUATE_HANDLERS } from "./evaluate";

describe('evaluate', () => {
    it('can pass along a constant', () => {
        const result = evaluateSExpression(5, EVALUATE_HANDLERS)
    })

    it('can add two numbers', () => {
        const result = evaluateSExpression(['add', 5, 3], EVALUATE_HANDLERS)
        expect(result).toEqual(8)
    })

    it('can handle a more complex expression', () => {
        const result = evaluateSExpression(['add', 5, ['add', 4, 3]], EVALUATE_HANDLERS)
        expect(result).toEqual(12)
    })

    it('can require context', () => {
        const ctx: Record<string, number> = { eddie: 100, billy: 200 }

        const scheme = {
            'name': (name: string) => ctx[name]
        }

        const result = evaluateSExpression(['name', 'eddie'], scheme)
        expect(result).toBe(100)
    })
})