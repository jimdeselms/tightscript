import { JavascriptInterpreter } from './JavascriptInterpreter';

describe('JavascriptInterpreter', () => {
    it('can evaluate a number', async () => {
        const i = new JavascriptInterpreter();
        const result = i.run('10');
        expect(result).toEqual(10); 
    })

    it('can evaluate a boolean', async () => {
        const i = new JavascriptInterpreter();
        const result = i.run('true');
        expect(result).toEqual(true); 
    })

    it('can negate a number', async () => {
        const i = new JavascriptInterpreter();
        const result = i.run('(- 5)');
        expect(result).toEqual(-5); 
    })

    it('can add two numbers', async () => {
        const i = new JavascriptInterpreter();
        const result = i.run('2 + 3');
        expect(result).toEqual(5); 
    })

    it('can negate a negate', async () => {
        const i = new JavascriptInterpreter();
        const result = i.run('-(-(5))');
        expect(result).toEqual(5); 
    })

    it('can do a more complex expression', async () => {
        const i = new JavascriptInterpreter();
        const result = i.run('5 + (3 + 2) + -(4 + 1)');
        expect(result).toEqual(5); 
    })

    it('can set and get a variable', async () => {
        const i = new JavascriptInterpreter();
        const result = i.run(`
            const x = 5;
            
            x`
        );
        expect(result).toEqual(5); 
    })

    it('can have multiple variables', async () => {
        const i = new JavascriptInterpreter();
        const result = i.run(`
            const x = 5;
            const y = 123;
            
            x + y`
        );
        expect(result).toEqual(128); 
    })

    it('can define a function', async () => {
        const i = new JavascriptInterpreter();
        const fn = i.run(`
            const add = () => 5 + 7;
            
            add`
        );

        const result = fn()
        expect(result).toEqual(12);
    })

    it('can define a function that takes an argument', async () => {
        const i = new JavascriptInterpreter();
        const fn = i.run(`
            const sub = (x, y) => x - y;
            
            sub`
        );

        const result = fn(10, 4)
        expect(result).toEqual(6);
    })

    it('can call a function that takes an argument', async () => {
        const i = new JavascriptInterpreter();
        const result = i.run(`
            const sub = (x, y) => x - y;
            
            sub(15, 3)`
        );

        expect(result).toEqual(12);
    })

    it('can define a function using function syntax', async () => {
        const i = new JavascriptInterpreter();
        const result = i.run(`
            function sub(x, y) { 
                return x - y;
            }
            
            sub(15, 3)`
        );

        expect(result).toEqual(12);
    })

    it('can reference a variable insidde a function', async () => {
        const i = new JavascriptInterpreter();
        const result = i.run(`

            function sub(x) { 
                const twenty = 20;
                return x - twenty;
            }
            
            sub(50)`
        );

        expect(result).toEqual(30);
    })

    it('can reference a variable defined outside a function', async () => {
        const i = new JavascriptInterpreter();
        const result = i.run(`

            const twenty = 20;

            function sub(x) { 
                return x - twenty;
            }
            
            sub(50)`
        );

        expect(result).toEqual(30);
    })

    it('can handle multiple variables with multiple declarations', async () => {
        const i = new JavascriptInterpreter();
        const result = i.run(`

            const five = 5, ten = 10;
            const fifty = 50, hundred = 100;

            five + ten + fifty + hundred;`
        );

        expect(result).toEqual(165);
    })
})