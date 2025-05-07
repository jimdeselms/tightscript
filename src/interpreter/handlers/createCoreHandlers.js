export function createCoreHandlers() {
    return {
        // types
        number: (val) => val,
        string: (val) => val,
        boolean: (val) => val,
        null: () => null,
        undefined: () => undefined,


        // arithmetic
        negate: (expr) => -expr,
        add: (l, r) => l + r,
        sub: (l, r) => l - r,
        mul: (l, r) => l * r,
        div: (l, r) => l / r,
    };
}