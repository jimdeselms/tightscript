import { SExpression } from './Expression.js'

export class BinaryExpr extends SExpression {
    constructor(lhs, rhs) {
        super()
        this.lhs = lhs
        this.rhs = rhs
    }

    canFail() {
        return this.lhs.canFail() || this.rhs.canFail()
    }

    needsArgs() {
        return this.lhs.needsArgs() || this.rhs.needsArgs()
    }

    canAdvance() {
        return this.lhs.canAdvance() || this.rhs.canAdvance()
    }

    cost() {
        return 1 + this.lhs.cost() + this.rhs.cost()
    }
    
    advance() {
        if (this.needsArgs()) {
            const lhs = this.lhs.advance()
            const rhs = this.rhs.advance()
            if (lhs === this.lhs && rhs === this.rhs) {
                return this
            } else {
                return new this.constructor(lhs, rhs)
            }
        }
    }
}

export class AddExpr extends BinaryExpr {
    constructor(lhs, rhs) {
        super(lhs, rhs)
    }

    evaluate(args) {
        return this.lhs.evaluate(args) + this.rhs.evaluate(args)
    }
}