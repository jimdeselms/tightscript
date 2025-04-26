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
    
    canFail() {
        return true
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
}