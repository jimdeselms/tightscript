import { SExpression } from './Expression.js'

export class IfExpr extends SExpression {

    constructor(condition, ifTrue, ifFalse) {
        super('if', condition, ifTrue, ifFalse)
    }

    // Evaluate fully to a resolved value, or throw an error
    evaluate(args) {
        const [ condition, ifTrue, ifFalse ] = this.args
        return condition.evaluate(args)
            ? ifTrue.evaluate(args)
            : ifFalse.evaluate(args)
    }

    // Advance the expression one step closer to its final form
    advance() {
        const [ condition, ifTrue, ifFalse ] = this.args
        if (condition.needsArgs()) {
            return new IfExpression(condition.advance(), ifTrue.advance(), ifFalse.advance())
        } else {
            const condValue = condition.evaluate()
            return condValue ? ifTrue.advance() : ifFalse.advance()
        }
    }

    cost() {
        // We want to know the maximum cost. We might want to split into min and max cost.
        const [ condition, ifTrue, ifFalse ] = this.args
        return 1 + condition.cost() + Math.max(ifTrue.cost() + ifFalse.cost())
    }

    // Meaning that it is fully evaluated
    isResolved() {
        return false
    }
}