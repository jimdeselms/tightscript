import { parseJavascript } from './parseJavascript.js';
import { createCompileToFnPipeline } from './compileToFnPipeline.js';

describe('parseJavascript', () => {
    it.each([
        ['10', 10],
        ['5 + 3', 8],
    ])('can compile a program', (program, expected) => {
        const result = evalProgram(program);
        expect(result(0)).toEqual(expected);
    })

    it('can set and get variables', () => {
        const code = `
            const x = 1;
            const y = 2;
            
            x + y`

        const result = evalProgram(code);
        expect(result(0)).toEqual(3);
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

function createPipeline() {
    const state = { memory: [], variables: {} }
    const pipeline = createCompileToFnPipeline(state)
    return [ state, pipeline ]
}
