// @ts-nocheck
import { expr } from './parse'

import { OPTIMIZE_PRIMITIVES } from './OPTIMIZE_PRIMITIVES'

export function optimize(sExpression, state) {
    if (Array.isArray(sExpression)) {
        const [primitive, ...args] = sExpression

        const handler = OPTIMIZE_PRIMITIVES[primitive]
        return handler(state, ...args)
    } else {
        return sExpression
    }
}
