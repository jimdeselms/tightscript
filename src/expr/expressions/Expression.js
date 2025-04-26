export class SExpression {

    constructor(primitive, ...args) {
        this.primitive = primitive,
        this.args = args
    }

    // If it's possible for this to fail.
    // It can fail if there is any path that can lead to an undefined or error that gets evaluated.
    canFail() {
        return this.args.some(arg => arg.canFail())
    }

    // This tells us if the expression can be evaluated without arguments. If it can,
    // then that the expression can be fully evaluated at compile time.
    needsArgs() {
        return this.args.some(arg => arg.needsArgs())
    }

    // Evaluate fully to a resolved value, or throw an error
    evaluate(args) {
        throw "NO IMPLEMENTATION"
    }

    canAdvance() {
        return this.args.some(arg => arg.canAdvance())
    }
    
    // Advance the expression one step closer to its final form
    advance() {
        throw "NO IMPLEMENTATION"
    }

    cost() {
        return this.args.reduce((acc, arg) => acc + arg.cost(), 1)
    }

    // Meaning that it is fully evaluated
    isResolved() {
        return false
    }
}