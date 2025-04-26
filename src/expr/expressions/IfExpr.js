import { SExpression } from './Expression.js'

export class IfExpr extends SExpression {

    constructor(condition, ifTrue, ifFalse) {
        super()
        this.condition = condition
        this.ifTrue = ifTrue
        this.ifFalse = ifFalse
    }

    // If it's possible for this to fail.
    // It can fail if there is any path that can lead to an undefined or error that gets evaluated.
    canFail() {
        return this.condition.canFail() || this.ifTrue.canFail() || this.ifFalse.canFail()
    }

    // This tells us if the expression can be evaluated without arguments. If it can,
    // then that the expression can be fully evaluated at compile time.
    needsArgs() {
        return this.condition.needsArgs || this.ifTrue.needsArgs() || this.ifFalse.needsArgs()
    }

    // Evaluate fully to a resolved value, or throw an error
    evaluate(args) {
        if (this.condition.evaluate(args)) {
            return this.ifTrue.evaluate(args)
        }
    }

    canAdvance() {
        return this.condition.canAdvance() || this.ifTrue.canAdvance() || this.ifFalse.canAdvance()
    }
    
    // Advance the expression one step closer to its final form
    advance() {
        if (this.condition.needsArgs()) {
            return new IfExpression(this.condition.advance(), this.ifTrue.advance(), this.ifFalse.advance())
        } else {
            const condition = this.condition.evaluate()
            return condition ? this.ifTrue.advance() : this.ifFalse.advance()
        }
    }

    cost() {
        return 1 + this.condition.cost() + Math.max(this.ifTrue.cost() + this.ifFalse.cost())
    }

    // Meaning that it is fully evaluated
    isResolved() {
        return false
    }
}