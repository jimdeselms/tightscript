import { OptimizingCompiler } from '../optimizing-compiler'
import { Parser } from 'acorn'
import { AstToSExpression } from './AstToSExpression'
import { BUILTINS } from './BUILTINS'

export class JavascriptCompiler {
    constructor() {
        this.compiler = new OptimizingCompiler()
        this.state = {
            scopes: [{}],
            functions: [],
        }

        for (const [name, body] of Object.entries(BUILTINS)) {
            const ordinal = this.compiler.state.fns.length
            this.compiler.declareFunction(ordinal, body)
            this.state.scopes[0][name] = ['fnref', ordinal]
        }
    }

    optimize(code) {
        const ast = Parser.parse(code, { ecmaVersion: 2020 });

        const converter = new AstToSExpression(this.state)
        const expr = converter.toExpr(ast)

        for (let i = 0; i < this.state.functions.length; i++) {
            this.compiler.declareFunction(i, this.state.functions[i][1])
        }

        return this.compiler.optimize(expr)
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
    externalize(obj, spread=false) {
        if (typeof obj === 'function') {
            return (...args) => {
                if (args.some(a => typeof a === 'function')) {
                    throw new Error('External functions may only be called with non-function arguments')
                } 

                const argFns = args.map(a => () => a)
                const result = spread ? obj(...argFns) : obj(argFns)
                return this.externalize(result, true)
            }
        } else if (Array.isArray(obj) && obj[0] === 'error') {
            throw new Error(obj[1])
        } else {
            // TODO - when we add complex types, we'll need to traverse the object
            return obj
        }
    }
}
