import { describe, it, expect } from 'vitest';

import * as Ops from './operations';
import { buildStackFunction } from './evaluate'
import { defer } from './composite'

describe('Composite Operations', () => {
    it('can add two ints', () => {
        const stack = [2, 3];
        const fn = buildStackFunction(Ops.ADD)
        fn(stack)
        expect(stack.pop()).toBe(5);
    })

    it('can add two strings', () => {
        const stack = ['World!', 'Hello, '];
        const fn = buildStackFunction(Ops.ADD)
        fn(stack)
        expect(stack.pop()).toBe('Hello, World!');
    })

    it('can negate a number', () => {
        const stack = [5];
        const fn = buildStackFunction(Ops.NEGATE)
        fn(stack)
        expect(stack.pop()).toBe(-5);
    })

    it('can defer building the stack function', () => {
        const stack = [5];

        // We can defer building the stack function
        const fn = buildStackFunction([() => Ops.NEGATE])
        fn(stack)
        expect(stack.pop()).toBe(-5);
    })
})