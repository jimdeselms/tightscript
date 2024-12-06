// This string contains the built in functions that we will provide

export const BUILTINS = `
let $ = [()=>$$]
function $L(fn) {
    let loaded, value;
    return () => {
        return loaded ? value : (loaded=true,value=fn(),value)
    }
}
`