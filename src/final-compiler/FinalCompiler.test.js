import { JsToJsCompiler } from '../js-to-js-compiler/JsToJsCompiler';

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

    it('can compile a function', () => {
        const fn = evaluate("(a) => a")
        expect(fn(10)).toBe(10)
    })

    it('can declare a variable', () => {
        const result = evaluate(`
            const fn = (x) => x + 1
            fn($0)`
        , 10)
        expect(result).toBe(11)
    })

    it('can build the lame fibbonacci function', () => {
        const result = evaluate(`
            function fibb(n) {
                return n <= 2 ? 1 : fibb(n-1) + fibb(n-2)
            }

            fibb(6)
        `)
        
        expect(result).toBe(8)
    })

    it('can have a local variable in a function', () => {
        const result = evaluate(`
            function doubleSum(x, y) {
                const sum = x + y
                const factor = 2

                return sum * factor
            }

            doubleSum(10, 20)
        `)
        
        expect(result).toBe(60)
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
    const compiler = new JsToJsCompiler()
    const compiled = compiler.compile(code)
    const fn = eval(compiled)

    const result = fn(...args)
    return result
}