export function createCoreHandlers() {
    return {
        // types
        number: (val) => val,
        string: (val) => val,
        boolean: (val) => val,
        null: () => null,
        undefined: () => undefined,

        property: (obj, prop) => {
            const [primitive, array] = obj
            if (primitive !== 'array') {
                throw new Error('property needs an array')
            }
            return array[prop]
        },

        // arithmetic
        negate: (expr) => -expr,
        add: (l, r) => l + r,
        sub: (l, r) => l - r,
        mul: (l, r) => l * r,
        div: (l, r) => l / r,

        // logical
        not: (expr) => !expr,
        ifelse: (cond, ifTrue, ifFalse) => {
            return cond ? ifTrue : ifFalse
        },
    };
}
