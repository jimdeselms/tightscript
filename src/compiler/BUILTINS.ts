// This string contains the built in functions that we will provide

export const BUILTINS = `
function LAZY(fn) {
    let loaded, value;
    return loaded ? value : (loaded=true,value=fn(),value)
}
`