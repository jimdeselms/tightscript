export class Interpreter {
    constructor(instantiateHandlers) {
        this.handlers = instantiateHandlers(this)
    }

    run(expr) {
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