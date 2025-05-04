import { pipeline } from './pipeline.js'

export function createCompileToFnPipeline(state = {}) {
    return pipeline(createHandlers(state))
}

function createHandlers(state) {
    return {
        arg: (index) => {
            const idx = index()
            return (...args) => args[idx]
        },

        set: (index, value) => (args) => {
            const idx = index(args)
            const val = value(args)
            state.memory[idx] = val
            return val
        },

        get: (index) => (args) => {
            const idx = index(args)
            return state.memory[idx]
        },

        number: (val) => () => val,
        string: (val) => () => val,

        negate: (expr) => (args) => expr(args) * -1,

        add: (lhs, rhs) => (args) => lhs(args) + rhs(args),
        sub: (lhs, rhs) => (args) => lhs(args) - rhs(args),
        mul: (lhs, rhs) => (args) => lhs(args) * rhs(args),
        div: (lhs, rhs) => (args) => lhs(args) / rhs(args),

        fn: (body) => () => (...params) => body(...params),

        call: (fn, arg) => (args) => {
            const func = fn(args)
            const argValue = arg(args)
            return func(argValue)
        },
    }
}
