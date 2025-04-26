import { SExpression } from './Expression.js'

export class ErrorExpr extends SExpression {
    constructor(payload) {
        super('error', payload)
    }

    mayBeError() {
        return true
    }
    
    evaluate(args) {
        throw new Error(this.args[0].evaluate(args))
    }

    advance() {
        return this
    }
}