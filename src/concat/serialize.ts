import { ExprFn } from "."

export type Token = string | number
export type Expression = Token | Expression[]

export type SerializeState = {
    inputExpression: Expression | null
    inProgress: Expression[]
    primitives: Token[]
}

export function INITIAL_STATE(inputExpression: Expression | null): SerializeState {
    return {
        inputExpression,
        inProgress: [],
        primitives: []
    }
}

export function serialize(state: SerializeState): ExprFn<SerializeState> | null {

    if (state.inProgress.length > 0) {
        const top = state.inProgress[state.inProgress.length - 1]
        if (typeof top === 'number' || typeof top === 'string') {
            state.inProgress.pop()
            state.primitives.push(top)
            return serialize
        } else if (Array.isArray(top)) {
            const last = top.pop()
            if (top.length === 0) {
                state.inProgress.pop()
            }
            state.inProgress.push(last!)
            return serialize
        }
    }

    if (state.inputExpression === null) {
        return null
    }

    if (typeof state.inputExpression === 'number' || typeof state.inputExpression === 'string') {
        const token = state.inputExpression
        state.inputExpression = null
        state.inProgress.push(token)
        
        return serialize
    }

    if (Array.isArray(state.inputExpression)) {
        const last = state.inputExpression.pop()
        if (state.inputExpression.length === 0) {
            state.inputExpression = null
        }
        state.inProgress.push(last!)
        return serialize
    }

    throw "ERROR"
}


/**
 * 
 * How do I want this to work?
 * 
 * If there is an "inProgress" list, then we'll take the last thing in the last list
 */