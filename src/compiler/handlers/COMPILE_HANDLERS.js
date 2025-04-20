export function COMPILE_HANDLERS(state, compile) {
    return {
        arg: (idx) => {
            return (args) => {
                // TODO - Can I figure out a more elegant way to do this?
                // I said that the only condition would be "if"
                if (args === undefined) { return undefined }

                const first = args[0]
                const i = idx(args)
                return i === undefined ? undefined : args[i]
            }
        },

        negate: (value) => {
            return (args) => -value(args)
        },

        add: (lhs, rhs) => {
            return (args) => lhs(args) + rhs(args)
        },

        error: (payload) => {
            return (args) => {
                const p = payload(args)
                return ['error', p]
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
            return (args) => {
                const val = value(args)
                return Array.isArray(val) && val[0] === 'error'
            }
        },

        fn: (body) => {
            return () => (...fnArgs) => body(fnArgs)
        }
    }
}