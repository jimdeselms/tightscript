export function createHandlers(interpreter) {
    
    return {
        number: (val) => val,
        string: (val) => val,
        boolean: (val) => val,
        null: () => null,
        undefined: () => undefined,
        negate: (expr) => {
            const value = interpreter.run(expr)
            return -value
        }
    }
}