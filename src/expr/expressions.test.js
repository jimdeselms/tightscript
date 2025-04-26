import { SExpr } from './expressions/SExpr'
import { parseExpression } from './parseExpression'
import { compileToFunction } from './compileToFunction'

describe('expressions', () => {
    describe('literal', () => {
        it.each([
            ['5', 5],
            ['-5', -5],
            ['"hello"', 'hello'],
            ['true', true],
            ['false', false],
            ['null', null],
        ])('can compile literal %s', (expr, expected) => {
            const expression = parseExpression(expr)
            const result = expression.evaluate()
            expect(result).toEqual(expected)
        });
    })

    describe('add', () => {
        it.each([
            ['10', '20', 30],
        ])('can compile add %s', (lhs, rhs, expected) => {
            const parsed = parseExpression(`(add ${lhs} ${rhs})`)
            const result = parsed.evaluate()
            expect(result).toEqual(expected)
        });
 
        it('throws when you evaluate undefined', () => {
            const expr = parseExpression('undefined')
            expect(() => expr.evaluate()).toThrow("UNDEFINED")
        })

        it('can compile to a function', () => {
            const expr = parseExpression('(add 5 10)')
            const fn = compileToFunction(expr)
            expect(fn()).toEqual(15)
        })

        it('can take an expression that needs arguments', () => {
            const expr = parseExpression('(add $0 20)')
            const fn = compileToFunction(expr)
            expect(fn(15)).toEqual(35)
        })

        it('can take an expression that needs two arguments', () => {
            const expr = parseExpression('(add $0 $1)')
            const fn = compileToFunction(expr)
            expect(fn(15, 50)).toEqual(65)
        })
    })

    describe('conditional', () => {
        it('can define a conditional expression that does not need arguments', () => {
            const expr = parseExpression('(if true 5 10)')
            const fn = compileToFunction(expr)
            expect(fn()).toEqual(5)
        })
    })

    describe('error', () => {
        it('can define an error', () => {
            const expr = parseExpression('(error "error message")')
            const fn = compileToFunction(expr)
            expect(() => fn()).toThrow("error message")
        })
    })
})