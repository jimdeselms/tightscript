import { Compiler } from '../compiler'
import { Parser } from 'acorn'
import { AstToSExpression } from './AstToSExpression'
import * as E from '../expressions/exprs'

export class JavascriptCompiler {
    constructor() {
        this.compiler = new Compiler()
        this.state = {
            variables: {},
            functions: [],
        }
    }

    compileExpression(code) {
        try {
            const ast = Parser.parse(code, { ecmaVersion: 2020 });

            const converter = new AstToSExpression(this.state)
            const expr = converter.toExpr(ast)

            for (let i = 0; i < this.state.functions.length; i++) {
                this.compiler.declareFunction(i, this.state.functions[i][1])
            }

            return this.compiler.compile(expr)

        } catch (error) {
          console.error("Parsing error:", error);
        }
    }
}
