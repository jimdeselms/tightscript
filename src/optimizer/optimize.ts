// @ts-nocheck
import { expr } from '../parse'

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
            if (newPrimitive !== 'quote' && newArgs.every(isOptimized)) {
                onOut(newPrimitive)
            }
        }
    } else if (typeof sExpression === 'function') {
        return optimize(sExpression(state), state, onOut)
    } else {
        typeof sExpression === 'string'
            ? onOut(`"${sExpression}"`)
            : onOut(sExpression)
    }
}

function isOptimized(sExpression) {
    return !Array.isArray(sExpression) && typeof sExpression !== 'function'
}