// This string contains the built in functions that we will provide

export const BUILTINS = `
debugger;
function $L(expr) {
    let prev, value;

    return (args) => {
        if (prev !== args) {
            prev = args
            value = expr(args)
        }
        return value
    }
}
`