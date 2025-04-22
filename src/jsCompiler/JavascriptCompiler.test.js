import { JavascriptCompiler } from "./JavascriptCompiler";

describe('JavascriptCompiler', () => {
    it.each([
        [ '5', 5 ],
        [ '-5', -5],
        [ '5 + 10', 15 ],
        [ '10 - 5', 5 ],
        [ 'true ? 1 : 2', 1],
        [ '5 < 10', true],
        [ '2 + undefined', undefined],
    ])('can compile expressions #%#', (js, expected) => {
        const compiler = new JavascriptCompiler()

        const fn = compiler.compileExpression(js)

        expect(fn(0)).toEqual(expected)
    })

    it('can declare and reference a variable', () => {
        const code = `
        let x = 5, y = 10
        
        x + y;`

        const compiler = new JavascriptCompiler()
        const fn = compiler.compileExpression(code)

        expect(fn(0)).toEqual(15)
    })
})