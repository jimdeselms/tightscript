import { SExpression } from './Expression.js'

export class ConstantExpr extends SExpression {
    constructor(value) {
        super()
        this.value = value
    }

    needsArgs() {
        return false
    }
    
    canFail() {
        return false
    }

    canAdvance() {
        return false
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
}