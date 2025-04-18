export function COMPILE_HANDLERS(state, compile) {
    return {
        arg: () => {
            return (arg) => arg
        },

        negate_safe: (value) => {
            return (arg) => -value(arg)
        },

        if: (cond, ifTrue, ifFalse) => {
            return (arg) => {
                return cond(arg) ? ifTrue(arg) : ifFalse(arg)
            }
        },

        isNumber: (value) => {
            return (arg) => typeof value(arg) === 'number'
        },

        isUndefined: (value) => {
            return (value) => value === undefined
        },

        fn: (body) => {
            return () => (fnArg) => body(fnArg)
        }
    }
}