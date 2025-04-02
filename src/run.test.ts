import { describe, it, expect } from 'vitest'
import { runMachine } from './runMachine'
import { evaluate } from './__FIXTURES__/evaluate'
import { expr } from './parse'

describe('runMachine', () => {
    it('can put a number on the stack', () => {
        const state = { stack: [] }

        runMachine(42, () => {}, state)

        expect(state.stack).toEqual([42])
    })

    it('can emit a numeric symbol', () => {
        const result = evaluate(expr`123`)
        expect(result).toEqual([123])
    })

    it('can emit a string symbol', () => {
        const result = evaluate('"hello"')
        expect(result).toEqual(["hello"])
    })

    it('can negate a number', () => {
        const result = evaluate(42, 'negate')
        expect(result).toEqual([-42])
    })

    it('can branch', () => {
        const result = evaluate(true, [[10], [20]])
        expect(result).toEqual([10])
    })

    it('can check if a thing is a number', () => {
        const result = evaluate(true, 'isNumber')
        expect(result).toEqual([false])
    })
})