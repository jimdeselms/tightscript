import { MappingScheme, SymbolicExpression } from './expression';

// We can evaluate symbolic expressions
export function evaluateSExpression(expr: SymbolicExpression, scheme: MappingScheme): SymbolicExpression {
    if (typeof expr === 'string') {
        return expr
    } else if (typeof expr === 'number') {
        return expr
    } else if (typeof expr === 'boolean') {
        return expr
    } else if (expr === null) {
        return expr as null
    } else if (Array.isArray(expr)) {
        const [first, ...rest] = expr
        const handlerName = first as string
        const mapper = scheme[handlerName]
        if (!mapper) {
            throw "No handler " + handlerName
        }

        // We've found the handler, call it.
        return mapper(...rest)
    } else {
        throw "Illegal expression type"
    }
}

