import { SExpression } from './Expression.js'

export class UndefinedExpr extends SExpression {
    constructor() {
        super(undefined)
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

    cost() {
        return 1
    }

    advance() {
        return this
    }

    isResolved() {
        return true
    }
}