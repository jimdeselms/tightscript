import { Compiler } from './compile'
import { parse } from '../parse'
import { it } from 'vitest'

describe('compile', () => {
    it('can compile a resovled expression', () => {
        const compiler = new Compiler()
        const expr = compiler.compile(5)

        expect(expr(0)).toBe(5)
    })

    it.each([
        [ "5", -5 ],
        [ "undefined", undefined ],
        [ "(negate 5)", 5 ],
        [ "(negate undefined)", undefined],
    ])('can negate $0', (expr, expected) => {
        const compiler = new Compiler()
        const sExpr = parse(`(negate ${expr})`)
        const compiled = compiler.compile(sExpr)
        const result = compiled(0)

        expect(result).toBe(expected)
    })

    it.each([
        ["(arg 0)", 5, 5],
        ["$", 5, 5],
        ["(negate $)", 5, -5]
    ])('can handle expression $0 with arg $1', (expr, arg, expected) => {
        const result = evaluate(expr, arg)

        expect(result).toBe(expected)
    })

    it.each([
        ['5', true],
        ['true', false],
    ])('isNumber $0', (expr, expected) => {
        const result = evaluate(`(isNumber ${expr})`)
        expect(result).toBe(expected)
    })

    it.each([
        ['undefined', true],
        ['5', false],
        ['(negate undefined)', true]
    ])('isUndefined $0', (expr, expected) => {
        const result = evaluate(`(isUndefined ${expr})`)
        expect(result).toBe(expected)
    })

    it.each([
        ['true', '1', '2', 1],
    ])('understands conditionals (if $0 $1 $2)', (cond, ifTrue, ifFalse, expected) => {
        const result = evaluate(`(if ${cond} ${ifTrue} ${ifFalse})`)

        expect(result).toBe(expected)
    })

    it('can compile an error', () => {
        const result = evaluate('(error "hello")')

        expect(result).toEqual(new Error("hello"))
    })

    it.each([
        [ '$', 10, 10 ],
        [ '(negate $)', 5, -5]
    ])('can define a function $0', (body, arg, expected) => {
        const fn = evaluate(`(fn ${body})`)

        const result = fn(arg)

        expect(result).toEqual(expected)
    })

    it.each([
        [ '$', [10], 10 ],
        [ '(negate $1)', [5, 20], -20]
    ])('can define a function that takes multiple arguments $0', (body, args, expected) => {
        const fn = evaluate(`(fn ${body})`)

        const result = fn(...args)

        expect(result).toEqual(expected)
    })
})

function evaluate(expr, ...args) {
    const compiler = new Compiler()
    const sExpr = parse(expr)
    const compiled = compiler.compile(sExpr)
    const result = compiled(args)
    return result
}
