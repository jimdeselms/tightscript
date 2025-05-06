export function createCoreHandlers(interpreter) {
    
    return {
        number: (val) => val,
        string: (val) => val,
        boolean: (val) => val,
        null: () => null,
        undefined: () => undefined,
        negate: (expr) => -expr,
        add: (l, r) => l + r,
    }
}