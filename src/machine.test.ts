import { describe, it, expect } from 'vitest';
import { machine } from './machine'

describe('machine', () => {
    it('can do stuff', () => {
        const state = { input: [10], stack: [] }
        machine(state)
        expect(state).toEqual({ input: [], stack: [10] })
    })

    it('can apply to a function', () => {
        const state = { input: [10, [5, 'add'], 'apply'], stack: [] }
        while (state.input.length > 0) machine(state)

        expect(state).toEqual({ input: [], stack: [15]})
    })
})