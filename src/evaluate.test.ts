import { describe, it, expect } from "vitest";

import { evaluate } from './evaluate'
import { expr } from './parse'

describe('evaluate', () => {
    it('can parse and return a number', () => {
        expect(evaluate(expr`10`)).toEqual(10)
    })

    it('can parse and negate a number', () => {
        expect(evaluate(expr`(negate 10)`)).toEqual(-10)
    })
})