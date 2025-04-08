import { describe, it, expect } from 'vitest';
import { machine } from './machine'

describe('machine', () => {
    it('can do stuff', () => {
        const state = { input: [10], stack: [] }
        machine(state)
        expect(state).toEqual({ input: [], stack: [10] })
    })
})