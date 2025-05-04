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

    it.each([
        ['(negate $0)', 5, -5],
    ])('functions "%s - %2"', (expr, arg, expected) => {
        const value = evalFn(expr, arg)
        expect(value).toEqual(expected)
    })

    it('can set and retrieve memory', () => {
        const expr = '(set 10 5)'
        const state = { memory: [] }
        const pipeline = createCompileToFnPipeline(state)
        const fn = pipeline(parse(expr))
        fn(undefined)
        expect(state.memory[10]).toBe(5)
    })
})

function evalExpr(str) {
    const sExpr = parse(str)
    const pipeline = createCompileToFnPipeline()
    
    const fn = pipeline(sExpr)
    return fn(undefined)
}

function evalFn(str, arg) {
    const sExpr = parse(str)

    const pipeline = createCompileToFnPipeline()
    const fn = pipeline(sExpr)
    return fn(arg)
}
