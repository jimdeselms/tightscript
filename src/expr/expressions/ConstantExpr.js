import { SExpr } from './SExpr.js'

export class ConstantExpr extends SExpr {
    constructor(value) {
        super(value)
        this.value = value
    }

    needsArgs() {
        return false
    }
    
    mayBeUndefined() {
        return false
    }

    mayBeError() {
        return false
    }

    canAdvance() {
        return false
    }

    cost() { 
        return 1
    }

    evaluate() {
        return this.value
    }

    advance() {
        return this
    }

    isResolved() {
        return true
    }

    toString() {
        return this.value.toString()
    }
}