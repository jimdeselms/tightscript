import { parse, parsePostfix } from './parse'
import { postfix } from './postfix'

describe('postfix', () => {
    it('can postfix a simple expression', () => {
        const sExpression = '5'
        const postfixExpr = '5'
        const s = parse(sExpression)
        const p = parsePostfix(postfixExpr)

        expect(postfix(s)).toEqual(p)
    })

    it('can differentiate between primitves and strings', () => {
        const sExpression = '(add x y)'
        const postfixExpr = 'add "x" "y"'

        const s = parse(sExpression)
        const p = parsePostfix(postfixExpr)

        expect(postfix(s)).toEqual(p)
    })
})