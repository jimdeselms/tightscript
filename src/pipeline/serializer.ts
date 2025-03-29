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
        for (const subExpr of expr.reverse()) {
            postfix(subExpr, onOut)
        }
    } else {
        onOut(expr as Token)
    }
}