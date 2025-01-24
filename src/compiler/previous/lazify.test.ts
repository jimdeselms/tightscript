import { parse, Node } from 'acorn'
import { describe, it, expect } from 'vitest'
import { lazify } from './lazify'

describe('lazify', () => {
    it('will not create two variables for the same expression', () => {
        const code = '5 + 5'

        const ast = parse(code, { ecmaVersion: 2023 })

        const ctx = {
            variables: [],
            shas: new Map<string, number>()
        }
    
        lazify(ast as any, ctx)
    
        // One for the addition expresseion, one for "5"
        expect(ctx.variables.length).toBe(2)
    })
})
