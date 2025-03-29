import { Pipeline, SExpression, Token } from './index.js';

export type EvaluatorState = {
    stack: Token[]
}

export const INITIAL_STATE: EvaluatorState = {
    stack: []
}

export const evaluator: Pipeline<Token, Token, EvaluatorState> = (onOut: (value: Token) => void) => {
    const state = structuredClone(INITIAL_STATE)

    return {
        send: (token: Token) => {
            if (isLiteral(token)) {
                if (typeof token === 'string' && token[0] === '"') {
                    state.stack.push(token.slice(1, -1))
                } else {
                    state.stack.push(token)
                }
            } else {
                evaluatePrimitive(token, state, onOut)
            }
        }
    };
}

function evaluatePrimitive(token: Token, state: EvaluatorState, onOut: (value: Token) => void) {
    const prim = PRIMITIVES[token as string]
    prim(state, onOut)
}

const PRIMITIVES: Record<string, (state: EvaluatorState, onOut: (value: Token) => void) => void> = {
    negate: (state) => {
        const value = state.stack.pop() as number
        state.stack.push(-value)
    }, 

    out: (state, onOut) => {
        const value = state.stack.pop()
        onOut(value)
    }
}

function isLiteral(token: Token): boolean {
    return typeof token !== 'string' || token[0] === '"'
}