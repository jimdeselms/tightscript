import { expect } from 'vitest';
import { Registry } from './Registry';
import { parse } from './parse'

describe('Registry', () => {
    it.each([
        [ '5', 5 ],
        [ '(test 123)', ['test', 123]]
    ])('can lookup $0 and get $1', (expr, expected) => {
        const registry = new Registry()
        const parsed = parse(expr)
        const result = registry.get(parsed)
        expect(result.expr).toEqual(expected)
    })

    it('can look up an expression with a different ', () => {
        const registry = new Registry()

        const expr = parse('(hello world)')
        const result = registry.get(expr)

        // We'll stick a value in here, and when we get the expression again, we expect it to still be there
        result.addedValue = 1

        // Recreate the expression and we'll still expect to find it.
        const expr2 = parse('(hello world)')
        const result2 = registry.get(expr2)

        expect(result2.addedValue).toEqual(1)
        expect(result2).toBe(result)
    })

    it('can define the simplified value for an expression', () => {
        const registry = new Registry()

        const expr = parse('(hello world)')
        registry.get(expr)

        const optimized = parse('(hi wrld)')
        registry.setDetail(expr, 'optimized', optimized)

        const originalDetails = registry.get(expr)
        const optimizedDetails = registry.get(optimized)

        expect(originalDetails.optimized).toBe(optimizedDetails.expr)
    })
})