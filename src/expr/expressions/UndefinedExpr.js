import { SExpr } from './SExpr.js'

export class UndefinedExpr extends SExpr {
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