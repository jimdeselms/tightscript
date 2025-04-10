import { describe, it, expect } from 'vitest';
import { createMachine } from './machine';

describe('Machine', () => {
    it('can run a simple machine', () => {
        const values: any[] = []
        const machine = createMachine((out) => values.push(out))

        machine(1)
        machine('out')

        expect(values).toEqual([1])
    })
})

