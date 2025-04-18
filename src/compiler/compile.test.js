import { Compiler } from './compile'
import { parse } from '../parse'

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
    ])('can negate $0', (expr, expected) => {
        const compiler = new Compiler()
        const sExpr = parse(`(negate ${expr})`)
        const compiled = compiler.compile(sExpr)
        const result = compiled(0)

        expect(result).toBe(expected)
    })

    it.each([
        ["(arg)", 5, 5],
        ["(negate (arg))", 5, -5]
    ])('can handle expression $0 with arg $1', (expr, arg, expected) => {
        const compiler = new Compiler()
        const sExpr = parse(expr)
        const compiled = compiler.compile(sExpr)
        const result = compiled(arg)

        expect(result).toBe(expected)
    })
})