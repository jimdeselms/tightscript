export function COMPILE_HANDLERS(state, compile) {
    return {
        arg: (idx) => {
            return (args) => {
                const first = args[0]
                const i = idx(first)
                return i === undefined ? undefined : args[i]
            }
        },

        negate_safe: (value) => {
            return (args) => -value(args)
        },

        add_safe: (lhs, rhs) => {
            return (args) => lhs(args) + rhs(args)
        },

        error: (payload) => {
            return (args) => {
                const p = payload(args)
                return new Error(p)
            }
        },

        if: (cond, ifTrue, ifFalse) => {
            return (args) => {
                return cond(args) ? ifTrue(args) : ifFalse(args)
            }
        },

        isNumber: (value) => {
            return (args) => typeof value(args) === 'number'
        },

        isUndefined: (value) => {
            return (args) => value(args) === undefined
        },

        isError: (value) => {
            return (args) => value(args) instanceof Error
        },

        fn: (body) => {
            return () => (...fnArgs) => body(fnArgs)
        }
    }
}