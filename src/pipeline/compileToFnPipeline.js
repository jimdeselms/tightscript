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

        set: (index, value) => {
            return (args) => {
                const idx = index(args)
                const val = value(args)
                state.memory[idx] = val
                return val
            }
        },

        get: (index) => {
            return (args) => {
                const idx = index(args)
                return state.memory[idx]
            }
        },

        number: (val) => () => val,
        string: (val) => () => val,

        negate: (expr) => {
            return (args) => expr(args) * -1
        },

        add: (lhs, rhs) => {
            return (args) => lhs(args) + rhs(args)
        },

        fn: (body) => {
            return (args) => {
                //const bod = body(args)
                return (...params) => {
                    return body(...params)
                }
            }
        }
    }
}
