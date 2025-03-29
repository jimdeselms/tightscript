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
                onOut(token)
            }
        }
    };
}

function isLiteral(token: Token): boolean {
    return typeof token === 'number'
}