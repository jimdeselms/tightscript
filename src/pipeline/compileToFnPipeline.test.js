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
        const [ state, pipeline ] = createPipeline()
        const fn = evalOnPipeline(pipeline,
            '(set 10 5)',
            '(get 10)'
        )

        const result = fn()

        expect(state.memory[10]).toBe(5)
        expect(result).toBe(5)
    })

    it.each([
        ['(fn $0)', 5, 5],
        ['(fn (add 2 $0))', 5, 7]
    ])('can define a function #%#', (fn, arg, expected) => {
        const func = evalExpr(fn)
        const result = func(arg)
        expect(result).toBe(expected)
    })

    it.each([
        ['(fn (negate $))', '5', -5],
        ['(fn (add $0 $0))', '5', 10],
    ])('can call a function', (fn, arg, expected) => {
        const expr = `(call ${fn} ${arg})`
        const result = evalExpr(expr)
        expect(result).toBe(expected)
    })

    it.each([
        ['(block (setvar a 5) ']
    ])
})

function evalOnPipeline(pipeline, ...exprs) {
    let current

    return (args) => {
        for (const expr of exprs) {
            const parsed = parse(expr)
            const fn = pipeline(parsed)
            current = fn(args)
        }

        return current
    }
}

function createPipeline() {
    const state = { memory: [] }
    const pipeline = createCompileToFnPipeline(state)
    return [ state, pipeline ]
}

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
