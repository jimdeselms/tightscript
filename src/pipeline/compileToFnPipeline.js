import { pipeline } from './pipeline.js'

export function createCompileToFnPipeline() {
    return pipeline(createHandlers())
}

function createHandlers() {
    return {
        number: (val) => () => val,
        string: (val) => () => val,

        negate: (expr) => {
            return (args) => expr(args) * -1
        },

        add: (lhs, rhs) => {
            return (args) => lhs(args) + rhs(args)
        }
    }
}
