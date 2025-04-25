import { JsToJsCompiler } from './js-to-js-compiler/JsToJsCompiler.js'

const code1 = `
function fibb(x) {
    return x <= 2 ? 1 : fibb(x-1) + fibb(x-2)
}
    
() => fibb(5)`

const code2 = `
function calcOvertime(hours, wage) {
    const percent150 = (x) => x * 1.5
    const overtime = hours > 40 ? (hours - 40) * percent150(wage) : 0
    return hours * wage + overtime
}

() => calcOvertime(50, 20)
`

const code3 = `
function min(x, y) {
    return x > y ? y : x
}
    
() => min(10, 20)`
const CODE = code1

function comparePerformance() {
    const compiler = new JsToJsCompiler()
    // const tightScriptFn = compiler.compileToInternalFunction(CODE)()
    const compiled = compiler.compile(CODE)
    const tightScriptFn = eval(compiled)()
    const jsFn = eval(CODE)

    const res1 = jsFn(0)
    const res2 = tightScriptFn(0)

    console.log("RESULTs:", res1, res2)
    if (res1 !== res2) {
        throw "Expected equal results"
    }
    
    time(tightScriptFn, "TightScript")
    time(jsFn, "JavaScript ")
}

function time(fn, name) {

    const start = performance.now()
    for (let i = 0; i < 100000; i++) {
        fn()
    }

    const duration = performance.now() - start
    const durationStr = duration.toFixed(2)
    const decimalIdx = durationStr.indexOf('.')
    const padded = "".padEnd(6 - decimalIdx) + durationStr

    console.log(`${name} took ${padded}ms`)
}

comparePerformance()