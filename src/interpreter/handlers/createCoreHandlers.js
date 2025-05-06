export function createCoreHandlers() {
    return {
        number: (val) => val,
        string: (val) => val,
        boolean: (val) => val,
        null: () => null,
        undefined: () => undefined,
        negate: (expr) => -expr,
        add: (l, r) => l + r,
    };
}