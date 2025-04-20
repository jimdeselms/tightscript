import * as E from './exprs'
import { parse, exprToString } from '../parse'
import { Compiler } from '../compiler'

describe('exprs', () => {
    it.each([
        ['5', "-5"],
        ['A', '(error "negate value must be a number")'],
        ['(error "some other error")', '(error "some other error")'],
    ])('negate #%#', (arg, expected) => {
        const expr = E.negate(parse(arg))
        const result = evaluate(expr)
        expect(result).toEqual(parse(expected))
    })

    it.each([
        ['5', "-5"],
        ['undefined', 'undefined'],
        ['A', '(error "negate value must be a number")'],
        ['(error "some other error")', '(error "some other error")'],
    ])('negate arg #%#', (arg, expected) => {
        const expr = E.negate(parse('$'))
        const result = evaluate(expr, parse(arg))
        expect(result).toEqual(parse(expected))
    })

    it.each([
        ["2", "3", "5"],
        ["undefined", "5", "undefined"],
        ["5", "undefined", "undefined"],
        ["A", "5", '(error "add lhs must be a number")'],
        ["5", "A", '(error "add rhs must be a number")'],
        ["(error 'some error')", "5", "(error 'some error')"],
        ["5", "(error 'some error')", "(error 'some error')"],
    ])('add #%#', (lhs, rhs, expected) => {
        const expr = E.add(parse(lhs), parse(rhs))
        const result = evaluate(expr)
        expect(result).toEqual(parse(expected))
    })
})

function evaluate(sExpr, ...args) {
    const compiler = new Compiler()
    const asString = exprToString(sExpr)
    const compiled = compiler.compile(sExpr)
    const result = compiled(args)
    return result
}
