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
        [ "undefined", undefined ],
        [ "(negate 5)", 5 ],
        [ "(negate undefined)", undefined],
        [ "X", new Error("negate value must be a number")],
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
        ["(negate $)", "X", new Error("negate value must be a number")],
    ])('can handle expression $0 with arg $1', (expr, arg, expected) => {
        const result = evaluate(expr, arg)

        expect(result).toEqual(expected)
    })

    it.each([
        ['5', '10', 15],
        ['(negate 5)', '10', 5],
        [undefined, 10, undefined]
        [10, undefined, undefined],
        ['notANumber', 10, new Error('add lhs must be a number')]
        [10, 'notANumber', new Error('add rhs must be a number')]
    ])('can add $0 and $1', (lhs, rhs, expected) => {
        expect(evaluate(`(add ${lhs} ${rhs})`)).toEqual(expected)
    })

    it.each([
        // { lhs: '$0', rhs: '5', arg: 2, expected: 7 },
        // { lhs: '2', rhs: '$0', arg: 2, expected: 4 },
        // { lhs: '$0', rhs: '$0', arg: 5, expected: 10 },
        { lhs: '(negate $0)', rhs: '(negate $0)', arg: 10, expected: -20 },
        // { lhs: '(negate $0)', rhs: '1', arg: "X", expected: new Error('add lhs must be a number') }
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
        ['(negate undefined)', true]
    ])('isUndefined $0', (expr, expected) => {
        const result = evaluate(`(isUndefined ${expr})`)
        expect(result).toBe(expected)
    })

    it.each([
        ['undefined', undefined],
        ['5', false],
        ['(error "Hello")', true],
        ['(negate "X")', true]
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
    const sExprStr = exprToString(sExpr)
    const compiled = compiler.compile(sExpr)
    const result = compiled(args)
    return result
}
