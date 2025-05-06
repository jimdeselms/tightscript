import { createCoreHandlers, createSafeHandlers } from './handlers.js';
import { parseJavascript } from './parseJavascript.js';
import { astToSExpression } from './astToSExpression.js';

export class JavascriptInterpreter {

    
    constructor() {
        this.compilerState = {
        }

        // These handlers will just do a thing with their parameters
        const coreHandlers = createCoreHandlers(this);
        const safeHandlers = createSafeHandlers(coreHandlers, isResolved, this.step.bind(this))

        this.handlers = {
            ...coreHandlers,
            ...safeHandlers,
            ast: (astNode) => {
                return astToSExpression(astNode, this.compilerState)
            },
            step: (expr) => this.step(expr),
        }
    }

    run(javascript) {
        const statements = parseJavascript(javascript)

        // We're only going to do the top one for now
        let expr = statements[0]

        while (!isResolved(expr)) {
            expr = this.step(expr)
        }
        return expr
    }

    step(expr) {
        if (Array.isArray(expr)) {
            const [primitive, ...args] = expr
            const handler = this.handlers[primitive]
            if (!handler) {
                throw new Error(`Unknown handler: ${primitive}`)
            }
            return handler(...args)
        } else {
            switch (typeof expr) {
                case 'string':
                    return this.handlers.string(expr)
                case 'number':
                    return this.handlers.number(expr)
                case 'boolean':
                    return this.handlers.boolean(expr)
                case 'undefined':
                    return this.handlers.undefined(expr)
                case 'object':
                    if (expr === null) {
                        return this.handlers.null(expr)
                    }
                    break
            }
            throw new Error(`Unknown type: ${typeof expr}`)
        }
    }
}

function isResolved(sExpr) {
    if (typeof sExpr !== 'object' || sExpr === null) {
        return true
    }

    // There may be more complex types that might be considered resolved in the future, like [object, { a: 123 }]
    return false
}