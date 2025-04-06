import { describe, it, expect } from 'vitest'
import { runMachine } from './runMachine'
import { evaluate, evaluateGetStack } from './__FIXTURES__/evaluate'
import { parse } from './support/parse'

describe('runMachine', () => {
    it('can put a number on the stack', () => {
        const state = { stack: [] }

        runMachine(42, () => {}, state)

        expect(state.stack).toEqual([42])
    })

    it('can emit a numeric symbol', () => {
        const result = evaluate(parse("123"))
        expect(result).toEqual(123)
    })

    it('can emit a string symbol', () => {
        const result = evaluate(parse('"hello"'))
        expect(result).toEqual("hello")
    })

    it.each([
        [ '42', -42 ],
        [ 'undefined', undefined ],
        [ 'null', new Error("not a number") ]
    ])('can negate a number #%#', (input, expected: any) => {
        const result = evaluate(parse(`${input} negate`))
        expect(result).toMatchObject(expected)
    })

    it.each([
        [ '10 assertNumber [10 add] [] cond', 20 ],
        [ 'undefined assertNumber [10 add] [] cond', undefined ],
        [ '10 assertNumber [undefined add] [] cond', undefined ],
        [ 'true assertNumber [undefined add] [] cond', new Error("not a number") ],
        [ '10 assertNumber [true add] [] cond', new Error("not a number") ],
    ])('can add two numbers #%#', (expr, expected: any) => {
        const result = evaluate(parse(expr))
        expect(result).toMatchObject(expected)
    })

    it('can branch', () => {
        // This (x, y) syntax means that if the thing on the top of the stack is true, then it'll return the first expression otherwise the second.
        const result = evaluate(parse("true [10] [20] cond"))
        expect(result).toEqual(10)
    })

    it('can run a code block', () => {
        const result = evaluate(parse("[10] eval"))
        expect(result).toEqual(10)
    })

    it('can run a code block that does nothing', () => {
        const result = evaluate(parse("10 [] eval"))
        expect(result).toEqual(10)
    })

    it('can check if a thing is a number', () => {
        const result = evaluate(parse("true isNumber"))
        expect(result).toEqual(false)
    })

    it('can create an error', () => {
        const result = evaluate(parse('"ERROR" error'))
        expect(result).toMatchObject({ message: "ERROR" })
    })

    it.each([
        [ '5 assertNumber', [5, true] ],//
        [ 'null assertNumber', [new Error("not a number"), false] ],
        [ 'undefined assertNumber', [undefined, false] ],
    ])('can assert that a thing is a number #%#', (expr, expected) => {
        const result = evaluateGetStack(parse(expr))
        expect(result).toEqual(expected)
    })
})