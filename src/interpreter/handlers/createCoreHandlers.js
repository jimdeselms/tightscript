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
            if (primitive === 'array') {
                return array[prop]
            } else if (primitive === 'object') {
                return array.find(([key]) => key === prop)?.[1]
            } else {
                throw new Error('property needs an array or object')
            }
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
