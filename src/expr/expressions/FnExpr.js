import { SExpr } from './SExpr.js'

export class FnExpr extends SExpr {

    constructor(body) {
        super('fn', body)
    }

    // Evaluate fully to a resolved value, or throw an error
    evaluate() {
        // Note that the outer args are ignored (though we may bring them back later)
        const body = this.args[0]
        return (...fnargs) => {
            return body.evaluate(fnargs)
        }
    }

    cost() {
        // The function itself is just a thing you pass around, and is therefore cheap
        return 1
    }
}