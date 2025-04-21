import * as E from './exprs'
import { parse, exprToString } from '../parse'
import { Compiler } from '../compiler'

describe('exprs', () => {
    describe('negate', () => {
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
    })

    describe('add', () => {
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

    describe('sub', () => {
        it.each([
            ["5", "2", "3"],
            ["undefined", "5", "undefined"],
            ["5", "undefined", "undefined"],
            ["A", "5", '(error "sub lhs must be a number")'],
            ["5", "A", '(error "sub rhs must be a number")'],
            ["(error 'some error')", "5", "(error 'some error')"],
            ["5", "(error 'some error')", "(error 'some error')"],
        ])('sub #%#', (lhs, rhs, expected) => {
            const expr = E.sub(parse(lhs), parse(rhs))
            const result = evaluate(expr)
            expect(result).toEqual(parse(expected))
        })
    })

    describe('mul', () => {
        it.each([
            ["5", "2", "10"],
            ["undefined", "5", "undefined"],
            ["5", "undefined", "undefined"],
            ["A", "5", '(error "mul lhs must be a number")'],
            ["5", "A", '(error "mul rhs must be a number")'],
            ["(error 'some error')", "5", "(error 'some error')"],
            ["5", "(error 'some error')", "(error 'some error')"],
            ["0", "undefined", "0"],
            ["undefined", "0", "0"],
            ["0", '(error "err")', "0"],
            ['(error "err")', "0", "0"],
        ])('mul #%#', (lhs, rhs, expected) => {
            const expr = E.mul(parse(lhs), parse(rhs))
            const result = evaluate(expr)
            expect(result).toEqual(parse(expected))
        })
    })

    describe('div', () => {
        it.each([
            ["5", "2", "3"],
            ["undefined", "5", "undefined"],
            ["5", "undefined", "undefined"],
            ["A", "5", '(error "div lhs must be a number")'],
            ["5", "A", '(error "div rhs must be a number")'],
            ["(error 'some error')", "5", "(error 'some error')"],
            ["5", "(error 'some error')", "(error 'some error')"],
            ["5", "0", '(error "division by zero")'],
        ])('div #%#', (lhs, rhs, expected) => {
            const expr = E.div(parse(lhs), parse(rhs))
            const result = evaluate(expr)
            expect(result).toEqual(parse(expected))
        })
    })
})

function evaluate(sExpr, ...args) {
    const compiler = new Compiler()
    const asString = exprToString(sExpr)
    const compiled = compiler.compile(sExpr)
    const result = compiled(args.map(arg => () => arg))
    return result
}
