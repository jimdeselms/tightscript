import { SExpression } from './Expression.js'

export class ConstantExpr extends SExpression {
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