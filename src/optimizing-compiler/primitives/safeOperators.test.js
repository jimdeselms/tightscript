import { OptimizingCompiler } from '../OptimizingCompiler'
import { expr, parse, exprToString } from '../../parse'

describe('safeOperators', () => {
    it.each([
        ["5", "(negate $0)", "(sub 5 (negate $0))"],
        ["(negate $0)", "5", "(sub_opp 5 (negate $0))"]
    ])('sub swap test #%#', (lhs, rhs, exprToFind) => {
        const 
            lhsExpr = parse(lhs),
            rhsExpr = parse(rhs)

        const safeExpr = expr`(sub_safe ${lhsExpr} ${rhsExpr})`

        const compiler = new OptimizingCompiler()
        const result = exprToString(compiler.optimize(safeExpr).optimizedExpr)
        
        expect(result.indexOf(exprToFind)).toBeGreaterThan(0)
    })

    it.each([
        ["5", "(negate $0)", 2, 3],
        ["undefined", "(negate $0)", 0, undefined],
        ["(negate $0)", "undefined", 0, undefined],
        ["(error FAIL)", "(negate $0)", 0, parse("(error FAIL)")],
        ["(negate $0)", "(error FAIL)", 0, parse("(error FAIL)")],
    ])('add_safe #%#', (lhs, rhs, arg, expected) => {
        const result = evaluate(`(add_safe ${(lhs)} ${rhs})`, arg)
        expect(result).toEqual(expected)
    })

    it.each([
        ["5", "(negate $0)", 2, 3]
    ])('sub_safe #%#', (lhs, rhs, arg, expected) => {
        const result = evaluate(`(add_safe ${(lhs)} ${rhs})`, arg)
        expect(result).toEqual(expected)
    })
})

function evaluate(expr, ...args) {
    const compiler = new OptimizingCompiler()
    const sExpr = parse(expr)
    const sExprStr = exprToString(sExpr)
    const compiled = compiler.compile(sExpr)
    const result = compiled(args.map(a => () => a))
    return result
}
