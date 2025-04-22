import { Compiler } from '../compiler'
import { Parser } from 'acorn'
import { astToSExpression } from './astToSExpression'
import * as E from '../expressions/exprs'

export class JavascriptCompiler {
    constructor() {
        this.compiler = new Compiler()
    }

    compileExpression(code) {
        try {
            const ast = Parser.parse(code, { ecmaVersion: 2020 });

            const expressionAst = ast.body[0].expression

            const expr = astToSExpression(expressionAst)            

            return this.compiler.compile(expr)

        } catch (error) {
          console.error("Parsing error:", error);
        }
    }
}
