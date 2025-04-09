import { describe, it, expect } from 'vitest';
import { machine } from './machine'

describe('machine', () => {
    it('can do stuff', () => {
        const state = { input: [10], stack: [] }
        machine(state)
        expect(state).toEqual({ input: [], stack: [10] })
    })

    it('can unquote a quote', () => {
        const state = { input: [[5, 10, 'add'], 'unquote'], stack: [] }
        while (state.input.length > 0) machine(state)

        expect(state).toEqual({ input: [], stack: [15]})
    })

    it('can build a function that uses its argument', () => {
        const state = { input: [['arg', 'arg', 'add'], 'fn'], stack: [], argStack: [] }
        while (state.input.length > 0) machine(state);

        const result = state.stack.pop() as any

        expect(result(5)).toEqual(10)
    })

    it('can build a function that does not use its argument', () => {
        const state = { input: [[5, 10, 'add'], 'fn'], stack: [], argStack: [] }
        while (state.input.length > 0) machine(state);

        const result = state.stack.pop() as any

        expect(result(null)).toEqual(15)
    })
})