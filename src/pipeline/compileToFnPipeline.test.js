import { createCompileToFnPipeline } from './compileToFnPipeline.js'
import { parse } from '../parse.js'
import { expect } from 'vitest'

describe('evalPipeline', () => {
    it('number', () => {
        const result = evalExpr('1')
        expect(result).toBe(1)
    })

    it.each([
        [ '"hello"', 'hello'],
        ["(negate 5)", -5],
        ["(add 2 4)", 6],
        ["(add (negate 3) (negate 4))", -7],
    ])('exprs "%s"', (expr, expected) => {
        const value = evalExpr(expr)
        expect(value).toEqual(expected)
    })
})

function evalExpr(str) {
    const sExpr = parse(str)
    const pipeline = createCompileToFnPipeline()
    
    const fn = pipeline(sExpr)
    return fn(undefined)
}
