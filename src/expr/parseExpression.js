import { parse } from '../parse.js'
import { E } from './expressions/index.js'

export function parseExpression(asString) {
    const sExpression = parse(asString)
    return toExpr(sExpression)
}

export function toExpr(sExpression) {
    if (Array.isArray(sExpression)) {
        const [ primitive, ...args ] = sExpression
        const exprClass = E[primitive]
        return new exprClass(...args.map(toExpr))
    } else {
        if (sExpression === undefined) {
            return E.undefined
        } else {
            return new E.constant(sExpression)
        }
    }
}

