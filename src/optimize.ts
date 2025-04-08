// @ts-nocheck
import { expr } from './parse'

export function optimize(sExpression, state) {
    if (Array.isArray(sExpression)) {
        const [primitive, ...args] = sExpression

        const handler = HANDLERS[primitive]
        return handler(state, ...args)
    } else {
        return sExpression
    }
}

const HANDLERS = {
    negate: (state, arg) => {
        return expr`(negate ${optimize(arg, state)})`
    }
}