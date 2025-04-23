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
    
            const fn = compiler.compileExpression(js)
    
            expect(fn(0)).toEqual(expected)
        })
    })

    it('can declare and reference a variable', () => {
        const code = `
            let x = 5, y = 10
            
            x + y;
        `

        const compiler = new JavascriptCompiler()
        const fn = compiler.compileExpression(code)

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
        const fn = compiler.compileExpression(code)
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
        const fn = compiler.compileExpression(code)
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
        const fn = compiler.compileExpression(code)
        expect(fn(0)).toEqual(5)
    })

    it('can declare and reference an arrow function', () => {
        const code = `
            const mul = (x, y) => x * y

            mul(10, 5)
        `

        const compiler = new JavascriptCompiler()
        const fn = compiler.compileExpression(code)
        expect(fn(0)).toEqual(50)
    })
})