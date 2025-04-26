import { SExpr } from './SExpr.js'

export class ErrorExpr extends SExpr {
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