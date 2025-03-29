import { Pipeline, SExpression, Token } from './index.js';

export type SerializerState = object

export const INITIAL_STATE: SerializerState = {
}

export const serializer: Pipeline<SExpression, Token, SerializerState> = (onOut: (value: Token) => void) => {
    return {
        send: (token: SExpression) => {
            postfix(token, onOut)
        }
    };
}

function postfix(expr: SExpression, onOut: (value: Token) => void) {
    if (Array.isArray(expr)) {
        for (let i = expr.length - 1; i > 0; i--) {
            const subExpr = expr[i]
            const quoted = typeof subExpr === 'string' ? `"${subExpr}"` : subExpr
            postfix(quoted, onOut)
        }
        postfix(expr[0], onOut)
    } else {
        onOut(expr as Token)
    }
}