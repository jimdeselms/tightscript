import { describe, it, expect } from 'vitest'
import { runMachine } from './runMachine'
import { evaluate } from './__FIXTURES__/evaluate'
import { parse } from './support/parse'

describe('runMachine', () => {
    it('can put a number on the stack', () => {
        const state = { stack: [] }

        runMachine(42, () => {}, state)

        expect(state.stack).toEqual([42])
    })

    it('can emit a numeric symbol', () => {
        const result = evaluate(parse("123"))
        expect(result).toEqual([123])
    })

    it('can emit a string symbol', () => {
        const result = evaluate(parse('"hello"'))
        expect(result).toEqual(["hello"])
    })

    it.each([
        [ '42', -42 ],
        [ 'undefined', undefined ]
    ])('can negate a number #%#', (input, expected) => {
        const result = evaluate(parse(`${input} negate`))
        expect(result).toEqual([expected])
    })

    it('can branch', () => {
        // This (x, y) syntax means that if the thing on the top of the stack is true, then it'll return the first expression otherwise the second.
        const result = evaluate(parse("true (10, 20)"))
        expect(result).toEqual([10])
    })

    it('can check if a thing is a number', () => {
        const result = evaluate(parse("true isNumber"))
        expect(result).toEqual([false])
    })
})