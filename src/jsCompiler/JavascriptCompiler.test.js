import { JavascriptCompiler } from "./JavascriptCompiler";

describe('JavascriptCompiler', () => {
    it.each([
        [ '5', 5 ],
        [ '5 + 10', 15 ],
        [ '10 - 5', 5 ],
        [ 'true ? 1 : 2', 1],
    ])('can compile expressions #%#', (js, expected) => {
        const compiler = new JavascriptCompiler()

        const fn = compiler.compileExpression(js)

        expect(fn(0)).toEqual(expected)
    })
})