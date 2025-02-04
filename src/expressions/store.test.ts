import { describe, it, expect } from 'vitest'

import { ExpressionStore } from './store'

describe('evaluate', () => {
    it('can store a number and it will always get the same hub expression', () => {
        const store = new ExpressionStore()
        const expr = store.get(5)

        expect(expr.symbolic).toBe(5)
    })

    it('can store a boolean', () => {
        const store = new ExpressionStore()
        const expr = store.get(true)

        expect(expr.symbolic).toBe(true)
    })
})