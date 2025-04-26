import { toExpr } from './parseExpression.js'

export function compileToFunction(expr) {
    if (expr.needsArgs()) {
        while (expr.canAdvance()) {
            expr = expr.advance()
        }
    }

    if (expr.canFail()) {
        return (...args) => {
            args = args.map(toExpr)
            try {
                return expr.evaluate(args)
            } catch (e) {
                if (e === "UNDEFINED") {
                    return undefined
                } else {
                    throw e
                }
            }
        }
    } else {
        return (...args) => {
            args = args?.map(toExpr)
            return expr.evaluate(args)
        }
    }
}
