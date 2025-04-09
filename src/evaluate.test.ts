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

    it('can negate undefined and return undefined', () => {
        expect(evaluate(expr`(negate undefined)`)).toEqual(undefined)
    })

    it('can propagate an error argument to negate', () => {
        expect(evaluate(expr`(negate (error fail))`)).toEqual(new Error("fail"))
    })

    it('can return an error when negating something that is not a number', () => {
        expect(evaluate(expr`(negate string)`)).toEqual(new Error("not a number"))
    })

    it('can return an error object', () => {
        expect(evaluate(expr`(error foo)`)).toEqual(new Error("foo"))
    })

    it.each([
        [100, true],
        ['"house"', false],
        [true, false]
    ])('can tell me if a value is a number', (value, expected) => {
        expect(evaluate(expr`(isNumber ${value})`)).toEqual(expected)
    })

    it.each(
        [
            [true, expr`(quote 1)`, expr`(quote 2)`, 1],
            [false, expr`(quote 1)`, expr`(quote 2)`, 2],
            [true, expr`(quote (negate 1))`, expr`(quote (negate 2))`, -1],
        ]
    )('can do conditionals #%#', (condition, ifTrue, ifFalse, expected) => {
        expect(evaluate(expr`(ifelse ${condition} ${ifTrue} ${ifFalse})`)).toEqual(expected)
    })

    it('can expand a function', () => {
        const fn = expr`(expand (quote (add 1 2)))`
        const result = evaluate(fn)
        expect(result).toEqual(3)
    })

    // it('can apply an argument to a function', () => {
    //     const quote = expr`(call )`
    // })
})