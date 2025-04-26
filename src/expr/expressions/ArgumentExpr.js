import { SExpr } from './SExpr.js'

export class ArgumentExpr extends SExpr {
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

    mayBeError() {
        // Unlike undefined, it's not possible for the outside environment to pass in an error.
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