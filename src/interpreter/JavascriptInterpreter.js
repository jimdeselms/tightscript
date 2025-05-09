import { createCoreHandlers, createResolveHandlers, createScopeHandlers, createParseHandlers } from './handlers/handlers.js';
import { parseJavascript } from './parseJavascript.js';

export class JavascriptInterpreter {

    
    constructor() {
        this.compilerState = {
        }

        // These handlers will just do a thing with their parameters
        const coreHandlers = createCoreHandlers(this);
        const safeHandlers = createResolveHandlers(isResolved, this.step.bind(this))
        const scopeHandlers = createScopeHandlers((e) => this.runStatement(e))
        const parseHandlers = createParseHandlers()

        this.handlers = {
            ...coreHandlers,
            ...safeHandlers,
            ...scopeHandlers,
            ...parseHandlers
        }
    }

    run(javascript, until=()=>false) {
        const statement = [ 'block', ...parseJavascript(javascript) ]

        // We're only going to do the top one for now
        return this.runStatement(statement, until)
    }

    runStatement(statement, until=()=>false) {
        let currExpr = statement
        
        while (!isResolved(currExpr) && !until(currExpr)) {
            currExpr = this.step(currExpr)
        }

        // The last one is the one we return
        return currExpr
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

    const primitive = sExpr[0]
    if (primitive === 'array') {
        return sExpr[1].every(isResolved)
    }

    return false
}