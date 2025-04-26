import { SExpression } from './Expression.js'

export class UndefinedExpr extends SExpression {
    constructor() {
        super(undefined)
    }

    mayBeUndefined() {
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

    toString() {
        return 'undefined'
    }
}