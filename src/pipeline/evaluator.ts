import { Pipeline, SExpression, Token } from './index.js';

export type EvaluatorState = {
    stack: Token[]
}

export const INITIAL_STATE: EvaluatorState = {
    stack: []
}

export const evaluator: Pipeline<Token, Token, EvaluatorState> = (onOut: (value: Token) => void) => {
    return {
        send: (token: Token) => {
            if (isLiteral(token)) {
                if (typeof token === 'string' && token[0] === '"') {
                    onOut(token.slice(1, -1))
                } else {
                    onOut(token)
                }
            }
        }
    };
}

function isLiteral(token: Token): boolean {
    return typeof token !== 'string' || token[0] !== '"'
}