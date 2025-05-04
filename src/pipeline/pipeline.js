export function pipeline(handlers) {

    const pipelineFn = (input) => {

        const handlerName = getSExpressionHandlerName(input)
        const handler = handlers[handlerName]

        if (Array.isArray(input)) {
            const [primitive, ...args] = input
            const resolvedArgs = args.map(arg => pipelineFn(arg))
            if (handler) {
                return handler(...resolvedArgs)
            } else {
                return [primitive, ...resolvedArgs]
            }
        } else {
            return handler(input)
        }
    }

    return pipelineFn
}

function getSExpressionHandlerName(sExpr) {
    if (Array.isArray(sExpr)) {
        return sExpr[0]
    } else {
        switch (typeof sExpr) {
            case 'string':
                return 'string'
            case 'number':
                return 'number'
            case 'boolean':
                return 'boolean'
            case 'undefined':
                return 'undefined'
            case 'object':
                if (sExpr === null) {
                    return 'null'
                }
        }

        throw new Error(`Unknown type: ${typeof sExpr}`)
    }
}
