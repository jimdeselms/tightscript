import { SExpr } from './SExpr.js'
import { toExpr } from '../parseExpression.js'

export class CallExpr extends SExpr {

    constructor(fn, arg) {
        super('call', fn, arg)
    }

    // Evaluate fully to a resolved value, or throw an error
    evaluate(args) {
        const [fn, arg] = this.args

        const fnval = fn.evaluate(args)
        const argval = arg.evaluate(args)

        return fnval(toExpr(argval))
    }

    cost() {
        // The function itself is just a thing you pass around, and is therefore cheap
        return 1
    }
}