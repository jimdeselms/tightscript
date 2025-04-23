import { JsToJsCompiler } from './JsToJsCompiler';

describe('JsToJsCompiler', () => {
    it.each([
        ["$0", 10, 10],
        ["[]", null, []],
        ["[1,2,3]", null, [1, 2,3]],
        ["[10 + 20,[50, 60],30-1]", null, [30, [50, 60], 29]],
    ])('expressions #%#', (code, arg, expected) => {
        const compiler = new JsToJsCompiler()
        const javascript = compiler.compile(code)
        const result = eval(javascript)(arg)

        expect(result).toEqual(expected)
    })
})