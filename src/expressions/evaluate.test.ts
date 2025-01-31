import { describe, it, expect } from 'vitest'

import { evaluateSExpression } from "./evaluateSExpression";
import { EVALUATE_HANDLERS } from "./evaluate";

describe('evaluate', () => {
    it('can pass along a constant', () => {
        const result = evaluateSExpression(5, EVALUATE_HANDLERS, )
    })

    it('can add two numbers', () => {
        const result = evaluateSExpression(['add', 5, 3], EVALUATE_HANDLERS)
        expect(result).toEqual(8)
    })
})