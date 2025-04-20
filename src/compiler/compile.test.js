import { Compiler } from './compile'
import { parse, exprToString } from '../parse'
import { expect, it } from 'vitest'

describe('compile', () => {
    it('can compile a resovled expression', () => {
        const compiler = new Compiler()
        const expr = compiler.compile(5)

        expect(expr(0)).toBe(5)
    })

    it.each([
        [ "5", -5 ],
        [ "(negate 5)", 5 ],
        [ "(negate (negate 5))", -5 ],
    ])('can negate $0', (expr, expected) => {
        const compiler = new Compiler()
        const sExpr = parse(`(negate ${expr})`)
        const compiled = compiler.compile(sExpr)
        const result = compiled(0)

        expect(result).toEqual(expected)
    })

    it.each([
        ["(arg 0)", 5, 5],
        ["$", 5, 5],
        ["(negate $)", 5, -5],
        ["(negate (negate $))", 5, 5],
//        ["(if (isUndefined $) undefined (negate $))", 5, -5],
    ])('can handle expression $0 with arg $1', (expr, arg, expected) => {
        const result = evaluate(expr, arg)

        expect(result).toEqual(expected)
    })

    it.each([
        [ "$0", 5, -5],
    ])('can negate $0 when arg is $1', (expr, arg, expected) => {
        const result = evaluate(`(negate ${expr})`, arg)

        expect(result).toEqual(expected)
    })

    it.each([
        ['5', '10', 15],
        ['(negate 5)', '10', 5],
    ])('can add $0 and $1', (lhs, rhs, expected) => {
        expect(evaluate(`(add ${lhs} ${rhs})`)).toEqual(expected)
    })

    it.each([
        { lhs: '$0', rhs: '5', arg: 2, expected: 7 },
        { lhs: '2', rhs: '$0', arg: 2, expected: 4 },
        { lhs: '(negate 2)', rhs: '$0', arg: 2, expected: 0 },
        { lhs: '$0', rhs: '$0', arg: 5, expected: 10 },
    ])('can add $lhs and $rhs where arg is $arg', ({ lhs, rhs, arg, expected }) => {
        expect(evaluate(`(add ${lhs} ${rhs})`, arg)).toEqual(expected)
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
    ])('isUndefined $0', (expr, expected) => {
        const result = evaluate(`(isUndefined ${expr})`)
        expect(result).toBe(expected)
    })

    it.each([
        ['5', false],
        ['(error "Hello")', true],
    ])('isError $0', (expr, expected) => {
        const result = evaluate(`(isError ${expr})`)
        expect(result).toEqual(expected)
    })

    it.each([
        ['true', '1', '2', 1],
    ])('understands conditionals (if $0 $1 $2)', (cond, ifTrue, ifFalse, expected) => {
        const result = evaluate(`(if ${cond} ${ifTrue} ${ifFalse})`)

        expect(result).toBe(expected)
    })

    it('can compile an error', () => {
        const result = evaluate('(error "hello")')

        expect(result).toEqual(['error', 'hello'])
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
        [ '(negate $1)', [5, 20], -20],
        [ '(add $0 $1)', [5, 20], 25],
        [ '(div $0 (sub $1 (negate $2)))', [100, 20, 5], 4],
    ])('can define a function that takes multiple arguments $0', (body, args, expected) => {
        const fn = evaluate(`(fn ${body})`)

        const result = fn(...args)

        expect(result).toEqual(expected)
    })

    it.each([
        ['5', '5', true],
        ['5', '6', false],
    ])('eq $0 $1', (lhs, rhs, expected) => {
        const result = evaluate(`(eq ${parse(lhs)} ${parse(rhs)})`)

        expect(result).toEqual(expected)
    })
})

function evaluate(expr, ...args) {
    const compiler = new Compiler()
    const sExpr = parse(expr)
    const sExprStr = exprToString(sExpr)
    const compiled = compiler.compile(sExpr)
    const result = compiled(args)
    return result
}
