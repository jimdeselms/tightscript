export function COMPILE_HANDLERS(state, compile) {
    const prims = {
        arg: (idx) => {
            return (args) => {
                return args[idx()]()
            }
        },

        fnref: (idx) => {
            // Like "arg", the index must be a resolved number.
            return () => {
                return state.fns[idx()]
            }
        },

        negate: (value) => {
            return (args) => -value(args)
        },

        add: (lhs, rhs) => { return (args) => lhs(args) + rhs(args) },
        sub: (lhs, rhs) => { return (args) => lhs(args) - rhs(args) },
        mul: (lhs, rhs) => { return (args) => lhs(args) * rhs(args) },
        div: (lhs, rhs) => { return (args) => lhs(args) / rhs(args) },
        lt: (lhs, rhs) => { return (args) => lhs(args) < rhs(args) },
        le: (lhs, rhs) => { return (args) => lhs(args) <= rhs(args) },
        gt: (lhs, rhs) => { return (args) => lhs(args) > rhs(args) },
        gte: (lhs, rhs) => { return (args) => lhs(args) >= rhs(args) },

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
            return (args) => {
                const result = typeof value(args) === 'number'
                return result
            }
        },

        isString: (value) => {
            return (args) => {
                const result = typeof value(args) === 'string'
                return result
            }
        },

        isBoolean: (value) => {
            return (args) => {
                const result = typeof value(args) === 'boolean'
                return result
            }
        },

        isUndefined: (value) => {
            return (args) => value(args) === undefined
        },

        isFunction: (value) => {
            return (args) => {
                const val = value(args)
                return typeof val === 'function'
            }
        },

        isError: (value) => {
            return (args) => {
                const val = value(args)
                return Array.isArray(val) && val[0] === 'error'
            }
        },

        // TODO - I want to make sure that the arguments to a function are themselves compiled expressions.
        fn: (body) => {
            return () => (...fnArgs) => body(fnArgs)
        },

        call: (fn, ...fnargs) => {
            return (args) => {
                // We need to capture the arguments so that we can use them to resolve the arguments later
                const fnValue = fn(args)

                return fnValue(...fnargs.map(arg => () => arg(args)))
            }
        },

        eq: (lhs, rhs) => {
            return (args) => {
                const l = lhs(args)
                const r = rhs(args)

                return l === r
            }
        }
    }

    return prims
}
