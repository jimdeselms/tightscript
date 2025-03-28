import { PRIMITIVES } from './primitives'

export function buildStackFunction(expression) {
    return (stack) => {
        return evaluateWithStack(expression, stack)
    }
}

function evaluateWithStack(expression, stack) {
    for (const primitive of expression) {
        if (typeof primitive === 'string') {
            const prim = PRIMITIVES[primitive]
            prim(stack)
        } else if (typeof primitive === 'function') {
            // If it's a deferred function, we need to call it to get the actual operation
            // This allows us to have big complex experssions that are built while they're being evaluated.
            const actualOps = primitive()
            evaluateWithStack(actualOps, stack)

            // A deferral must also be the last thing in the list.
            return
        } else {
            // If it's an array, it's a 2-tuple of iftrue/iffalse
            if (stack.pop()) {
                evaluateWithStack(primitive[0], stack)
            } else {
                evaluateWithStack(primitive[1], stack)
            }

            // Either way, conditionals must be the last thing in the list, so we can just return now.
            return
        }
    }
}