import { ExprFn } from '.'

export type Token = string | number
export type Expression = Token | Expression[]

export type EvaluationState = {
    primitives: Token[]
    stack: Token[]
}

export function INITIAL_STATE(...primitives: Token[]): EvaluationState {
    return {
        primitives,
        stack: []
    }
}

export function evaluate(state: EvaluationState): ExprFn<EvaluationState> | null {
    if (state.primitives.length === 0) {
        return null
    }

    const top = state.primitives.shift()
    if (typeof top === 'number') {
        state.stack.push(top)
        return evaluate
    } else if (typeof top === 'string') {
        const primitive = PRIMITIVES[top]
        if (!primitive) {
            throw "Unknown primitive " + top
        }

        primitive(state)
        
        return evaluate
    }

    throw "ERROR"
}


/**
 * 
 * How do I want this to work?
 * 
 * If there is an "inProgress" list, then we'll take the last thing in the last list
 */

const PRIMITIVES: Record<string, (state: EvaluationState) => void> = {
    add: (state) => {
        const a = state.stack.pop() as number
        const b = state.stack.pop() as number
        state.stack.push(a + b)
    }
}