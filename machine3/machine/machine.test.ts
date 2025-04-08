import { describe, it, expect } from 'vitest';
import { machine } from './machine'
import { expr } from './parse';

describe('machine', () => {
    it('can do stuff', () => {
        const input = expr`10`
        const output = machine(input)
        expect(output).toEqual([10])
    })
})