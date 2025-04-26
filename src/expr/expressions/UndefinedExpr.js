import { SExpression } from './Expression.js'

export class UndefinedExpr extends SExpression {
    constructor() {
        super()
    }

    canFail() {
        return true
    }

    evaluate() {
        throw new Error("UNDEFINED")
    }

    canAdvance() {
        return false
    }

    advance() {
        return this
    }

    isResolved() {
        return true
    }
}