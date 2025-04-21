import { astToSExpression } from "./astToSExpression";
import { exprToString } from '../parse'
import * as E from '../expressions/exprs'
import { Parser } from 'acorn'

describe("astToSExpression", () => {
    it.each([
        ["5", 5],
        ["5 + 6", E.add(5, 6)],
    ])('should convert %s', (code, expected) => {
        const ast = getExpressionAst(code)
        const expr = astToSExpression(ast);

        expect(expr).toEqual(expected);
    })

    it("should convert a simple expression", () => {
        const code = "5";
        const ast = getExpressionAst(code)
        const expr = astToSExpression(ast);
        const str = exprToString(expr)

        expect(str).toEqual("5");
    });

})

function getExpressionAst(code) {
    const ast = Parser.parse(code, { ecmaVersion: 2020 });
    return ast.body[0].expression
}
