import { SExpr } from './SExpr.js'
import { toExpr } from '../parseExpression.js'

export class BinaryExpr extends SExpr {
    constructor(primitive, lhs, rhs) {
        super(primitive, lhs, rhs)
    }

    // For a binary expression, we want to reorder the arguments so that the one that can be undefined will be first. 
    // We want to short-circuit as quickly as possible.
    //
    // If both can be undefined, or neither can, then we pick the one with the lower cost.


    swap() {
        const [lhs, rhs] = this.args
        const swapped = SWAPPED[this.primitive]
        return toExpr(swapped, rhs, lhs)
    }
}

export class AddExpr extends BinaryExpr {
    constructor(lhs, rhs) {
        super('add', lhs, rhs)
    }

    evaluate(args) {
        return this.args[0].evaluate(args) + this.args[1].evaluate(args)
    }
}