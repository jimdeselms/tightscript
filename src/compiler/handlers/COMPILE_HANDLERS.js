export function COMPILE_HANDLERS(state, compile) {
    return {
        arg: () => {
            return (arg) => arg
        },

        negate: (value) => {
            return (arg) => -value(arg)
        }
    }
}