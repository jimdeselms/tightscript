import { JsToJsCompiler } from '../js-to-js-compiler/JsToJsCompiler.js';

describe('WasmCompiler', () => {
    it.each([
        [ '5', 0, 5 ],
        [ '$', 10, 10 ],
    ])('can compile a simple expression', async (code, arg, expected) => {
        const result = await compileToWebAssembly(code)

        expect(result(arg)).toEqual(expected)
    })
})

async function compileToWebAssembly(code) {
    const compiler = new JsToJsCompiler()
    const fn = await compiler.compileToWebAssembly(code)

    return fn
}