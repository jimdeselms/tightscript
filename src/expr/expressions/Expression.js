export class SExpression {

    constructor() {
    }

    // If it's possible for this to fail.
    // It can fail if there is any path that can lead to an undefined or error that gets evaluated.
    canFail() {
        throw "NO IMPLEMENTATION"
    }

    // This tells us if the expression can be evaluated without arguments. If it can,
    // then that the expression can be fully evaluated at compile time.
    needsArgs() {
        throw "NO IMPLEMENTATION"
    }

    // Evaluate fully to a resolved value, or throw an error
    evaluate(args) {
        throw "NO IMPLEMENTATION"
    }

    canAdvance() {
        throw "NO IMPLEMENTATION"
    }
    
    // Advance the expression one step closer to its final form
    advance() {
        throw "NO IMPLEMENTATION"
    }

    // Meaning that it is fully evaluated
    isResolved() {
        return false
    }
}