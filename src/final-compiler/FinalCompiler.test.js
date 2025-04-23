import { FinalCompiler } from './FinalCompiler';
import { parse } from '../parse';
import { JavascriptCompiler } from '../jsCompiler';

describe('FinalCompiler', () => {
    it('can compile a very simple stream', () => {
        const result = evaluate('5')
        expect(result).toEqual(5)
    })

    it('can add two numbers', () => {
        const result = evaluate('5 + $0', 5)
        expect(result).toEqual(10)
    })

    it.each([
        [5, 10, 10],
        [5, 5, 5],
        [12, 5, 12],
    ])('can evaluate a conditional', (arg1, arg2, expected) => {
        const max = evaluate('$0 > $1 ? $0 : $1', arg1, arg2)
        expect(max).toEqual(expected)
    })

    // it('can compile an add', () => {
    //     const expr = parsePostfix("5 2 add")

    //     const compiler = new StreamCompiler()
    //     const compiled = compiler.compile(expr)

    //     const fn = eval(compiled)

    //     expect(fn(0)).toEqual(7)
    // })
})

function evaluate(code, ...args) {
    const jsCompiler = new JavascriptCompiler()
    const sExpr = jsCompiler.optimize(code)

    const compiler = new FinalCompiler()
    const compiled = compiler.compile(sExpr)
    const fn = eval(compiled)

    const result = fn(...args)
    return result
}