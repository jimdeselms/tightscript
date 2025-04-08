// @ts-nocheck

/**
 * Runs one cycle of the machine
 * @param state The state of the machine
 */
function stepMachine(state) {
    if (!("expr" in state)) {
        return false
    }

    // Get the s-expression to simplify
    const { expr } = state

    if (Array.isArray(expr)) {
        const [ primitive, ...args ] = expr

        const fn = PRIMITIVES[primitive]

        if (!fn) {
            throw "Primitive not found " + primitive
        }

        fn(state, ...args)
    } else {
        // It's a literal, we're done processing.
        state.result = expr
        delete state.expr
        return false
    }
}

function runMachine(state) {
    while (stepMachine(state)) {
    }
}

function runMachineAsFunction(sExpression) {
    const state = {
        expr: sExpression,
        stack: [],
    }

    runMachine(state)

    return state.result
}