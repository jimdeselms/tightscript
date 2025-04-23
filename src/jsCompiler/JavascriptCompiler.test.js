import { expr } from "../parse";
import { JavascriptCompiler } from "./JavascriptCompiler";

describe('JavascriptCompiler', () => {
    describe('simple', () => {
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
    
            const fn = compiler.compile(js)
    
            expect(fn(0)).toEqual(expected)
        })
    })

    it('can declare and reference a variable', () => {
        const code = `
            let x = 5, y = 10
            
            x + y;
        `

        const compiler = new JavascriptCompiler()
        const fn = compiler.compile(code)

        expect(fn(0)).toEqual(15)
    })

    it('can declare and call a function', () => {
        const code = `
            function add(x, y) {
                return x + y * x
            }
                
            add(2, 3);
        `

        const compiler = new JavascriptCompiler()
        const fn = compiler.compile(code)
        expect(fn(0)).toEqual(8)
    })

    it('can scope variables inside the function and they are not accessible outside the function', () => {
        const code = `
            const var1 = 100

            function add(x, y) {
                const var1 = 500
                return x + y + var1
            }

            // Here, var1 refers to the first one.
            add(2, 3) + var1
        `

        const compiler = new JavascriptCompiler()
        const fn = compiler.compile(code)
        expect(fn(0)).toEqual(605)
    })

    it('can do the fibbonacci sequence', () => {
        const code = `
            function fibb(n) {
                return n <= 2 ? 1 : fibb(n-1) + fibb(n-2)
            }

            fibb(5)
        `

        const compiler = new JavascriptCompiler()
        const fn = compiler.compile(code)
        expect(fn(0)).toEqual(5)
    })

    it('can declare and reference an arrow function', () => {
        const code = `
            const mul = (x, y) => x * y

            mul(10, 5)
        `

        const compiler = new JavascriptCompiler()
        const fn = compiler.compile(code)
        expect(fn(0)).toEqual(50)
    })

    it.each([
        [10, 20, 10],
        // [undefined, 5, undefined],
        // [5, undefined, undefined],
    ])('will return undefined if the input is undefined', (arg1, arg2, expected) => {
        const code = `
            const min = (x, y) => x > y ? y : x;
    
            min
        `

        const compiler = new JavascriptCompiler()
        const outerFn = compiler.compile(code)
        const fn = outerFn(0)
        expect(fn(arg1, arg2)).toEqual(expected)
    })

    it('will not allow the external function to be called with a function', () => {
        const code = '(x) => x * 2'
        const compiler = new JavascriptCompiler()
        const fn = compiler.compile(code)
        expect(() => fn(() => 5)).toThrow('External functions may only be called with non-function arguments')
    })

    it('can take a function as an argument to an internal function', () => {
        const code = `
            const apply = (fn, arg) => fn(arg)
            const double = (x) => x * 2
            apply(double, 5)
        `

        const compiler = new JavascriptCompiler()
        const result = compiler.compile(code)()

        expect(result).toEqual(10)
    })

    it('can reference the arguments passed into the program', () => {
        const code = `
            $0
        `

        const compiler = new JavascriptCompiler()
        const program = compiler.compile(code)
        const result = program(10)

        expect(result).toEqual(10)
    })

    it('an error returned at the top level becomes a thrown error', () => {
        const code = `error("This is an error")`

        const compiler = new JavascriptCompiler()
        const program = compiler.compile(code)

        expect(() => program(10)).toThrow('This is an error')
    })

    it('we can get past error with a conditional and isError', () => {
        const code = `isError(error("This is an error")) ? "DISASTER AVERTED" : "ERROR"`

        const compiler = new JavascriptCompiler()
        const program = compiler.compile(code)

        expect(program(10)).toEqual("DISASTER AVERTED")
    })

    it('we can coalesce undefined with isUndefined', () => {
        const code = `isUndefined(undefined) ? "NOT UNDEFINED ANYMORE" : "UNDEFINED"`

        const compiler = new JavascriptCompiler()
        const program = compiler.compile(code)

        expect(program(10)).toEqual("NOT UNDEFINED ANYMORE")
    })

    it('I cannot call a thing that is not a function', () => {
        const code = '("NOT A FUNCTION")(5)'

        const compiler = new JavascriptCompiler()
        const program = compiler.compile(code)

        expect(() => program(10)).toThrow("call target must be a function")
    })

    it('Calling undefined yields undefined', () => {
        const code = '(undefined)(5)'

        const compiler = new JavascriptCompiler()
        const program = compiler.compile(code)

        expect(program(10)).toBeUndefined()
    })
})

