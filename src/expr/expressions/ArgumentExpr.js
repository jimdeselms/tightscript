import { SExpression } from './Expression.js'

export class ArgumentExpr extends SExpression {
    constructor(idx) {
        super()
        this.idx = idx.evaluate()
    }

    needsArgs() {
        return true
    }

    canAdvance() {
        return false
    }
    
    mayBeUndefined() {
        return true
    }

    cost() {
        return 1
    }

    evaluate(args) {
        return args[this.idx].evaluate()
    }

    advance() {
        return this
    }

    isResolved() {
        return false
    }

    toString() {
        return '$' + this.idx
    }
}