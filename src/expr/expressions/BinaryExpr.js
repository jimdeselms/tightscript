import { SExpression } from './Expression.js'

export class BinaryExpr extends SExpression {
    constructor(primitive, lhs, rhs) {
        super(primitive, lhs, rhs)
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