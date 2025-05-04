import { parseJavascript } from './parseJavascript.js';
import { createCompileToFnPipeline } from './compileToFnPipeline.js';

describe('parseJavascript', () => {
    it('can compile a program', () => {
        const program = `
            10
        `;

        const result = evalProgram(program);
        expect(result(0)).toEqual(10);
    })
})

function evalProgram(code) {
    const exprs = parseJavascript(code)
    const [ state, pipeline ] = createPipeline()

    return (args) => {
        let result
        for (const expr of exprs) {
            const fn = pipeline(expr)
            result = fn(args)
        }
    
        return result
    }
}

function evalOnPipeline(pipeline, ...exprs) {
    let current

    return (args) => {
        for (const expr of exprs) {
            const parsed = parse(expr)
            const fn = pipeline(parsed)
            current = fn(args)
        }

        return current
    }
}

function createPipeline() {
    const state = { memory: [] }
    const pipeline = createCompileToFnPipeline(state)
    return [ state, pipeline ]
}

function evalExpr(str) {
    const sExpr = parse(str)
    const pipeline = createCompileToFnPipeline()
    
    const fn = pipeline(sExpr)
    return fn(undefined)
}

function evalFn(str, arg) {
    const sExpr = parse(str)

    const pipeline = createCompileToFnPipeline()
    const fn = pipeline(sExpr)
    return fn(arg)
}
