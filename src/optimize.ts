// @ts-nocheck
import { expr } from './parse'

import { OPTIMIZE_PRIMITIVES } from './OPTIMIZE_PRIMITIVES'

export function optimize(sExpression, state, onOut) {
    if (Array.isArray(sExpression)) {
        const [primitive, ...args] = sExpression

        const handler = OPTIMIZE_PRIMITIVES[primitive]
        if (!handler) {
            throw new Error(`Unknown optimizer primitive: ${primitive}`)
        }
        const result = handler(state, onOut, ...args)
        if (Array.isArray(result)) {
            const [newPrimitive, ...newArgs] = result
            if (newPrimitive !== 'fn' && newArgs.every(isOptimized)) {
                onOut(newPrimitive)
            }
        }
    } else if (typeof sExpression === 'function') {
        return optimize(sExpression(state), state, onOut)
    } else {
        onOut(sExpression)
        return sExpression
    }
}

function isOptimized(sExpression) {
    return !Array.isArray(sExpression)
}