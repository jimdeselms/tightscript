import { SExpression } from './expressions/Expression'
import { parseExpression } from './expressions/parseExpression'
import { compileToFunction } from './expressions/compileToFunction'

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
    })
})