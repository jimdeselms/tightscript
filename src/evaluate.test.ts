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

    it('can add two numbers', () => {
        expect(evaluate(expr`(add 10 20)`)).toEqual(30)
    })

    it('can add two expressions', () => {
        expect(evaluate(expr`(add (negate 10) (negate 20))`)).toEqual(-30)
    })

    it.each([
        [100, true],
        ['"house"', false],
        [true, false]
    ])('can tell me if a value is a number', (value, expected) => {
        expect(evaluate(expr`(isNumber ${value})`)).toEqual(expected)
    })
})