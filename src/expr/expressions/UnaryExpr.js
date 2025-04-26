import { SExpr } from './SExpr.js'
import { toExpr } from '../parseExpression.js'
import { FALSE } from './ConstantExpr.js'

export class UnaryExpr extends SExpr {
    constructor(primitive, arg) {
        super(primitive, arg)
    }
}

export class IsUndefinedExpr extends UnaryExpr {
    constructor(arg) {
        super('isUndefined', arg)
    }

    // isUndefined is the only thing that is allowed to inspect undefined without it short circuiting
    mayBeUndefined() {
        return false
    }

    advance() {
        const [arg] = this.args
        if (arg.mayBeUndefined()) {
            return FALSE
        }
        return toExpr('isUndefined', arg.advance())
    }

    evaluate(args) {
        const result = this.args[0].evaluateSafe(args)
        return result === undefined
    }
}