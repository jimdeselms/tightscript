import { Compiler } from '../compiler'
import { Parser } from 'acorn'
import { AstToSExpression } from './AstToSExpression'

export class JavascriptCompiler {
    constructor() {
        this.compiler = new Compiler()
        this.state = {
            scopes: [{}],
            functions: [],
        }
    }

    compile(code) {
        try {
            const ast = Parser.parse(code, { ecmaVersion: 2020 });

            const converter = new AstToSExpression(this.state)
            const expr = converter.toExpr(ast)

            for (let i = 0; i < this.state.functions.length; i++) {
                this.compiler.declareFunction(i, this.state.functions[i][1])
            }

            const fn = this.compiler.compile(expr)

            return this.externalize(fn)

        } catch (error) {
          console.error("Parsing error:", error);
        }
    }

    // Takes the thing and applies whatever fixes to it that we need to to make it work with the outside world
    externalize(obj) {
        if (typeof obj === 'function') {
            return (...args) => {
                if (args.some(a => typeof a === 'function')) {
                    throw new Error('External functions may only be called with non-function arguments')
                } 
                return this.externalize(obj(...args.map(a => () => a)))
            }
        } else {
            // TODO - when we add complex types, we'll need to traverse the object
            return obj
        }
    }
}
