// A function that modifies state and then returns the next function to call with the modified state, until there are no more changes to make.
export type ExprFn<TState> = (state: TState) => ExprFn<TState> | null

export type Token = string | number
export type Expression = Token | Expression[]

export type EvalState = {
    inputExpression: Expression | null
    inProgress: Expression[]
    outputPrimitives: Token[]
}

export function INITIAL_STATE(inputExpression: Expression | null): EvalState {
    return {
        inputExpression,
        inProgress: [],
        outputPrimitives: []
    }
}

export function evaluate(state: EvalState): ExprFn<EvalState> | null {

    if (state.inProgress.length > 0) {
        const top = state.inProgress[state.inProgress.length - 1]
        if (typeof top === 'number' || typeof top === 'string') {
            state.inProgress.pop()
            state.outputPrimitives.push(top)
            return evaluate
        } else if (Array.isArray(top)) {
            const last = top.pop()
            if (top.length === 0) {
                state.inProgress.pop()
            }
            state.inProgress.push(last!)
            return evaluate
        }
    }

    if (state.inputExpression === null) {
        return null
    }

    if (typeof state.inputExpression === 'number' || typeof state.inputExpression === 'string') {
        const token = state.inputExpression
        state.inputExpression = null
        state.inProgress.push(token)
        
        return evaluate
    }

    if (Array.isArray(state.inputExpression)) {
        const last = state.inputExpression.pop()
        if (state.inputExpression.length === 0) {
            state.inputExpression = null
        }
        state.inProgress.push(last!)
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