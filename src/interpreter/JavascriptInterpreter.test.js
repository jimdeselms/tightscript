import { JavascriptInterpreter } from './JavascriptInterpreter.js';
import { sexpr } from './parseSExpression.js'

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

    it('can define a function takes a function as an argument', async () => {
        const i = new JavascriptInterpreter();
        const result = i.run(`
            const double = (x) => x * 2;
            
            const modify = (val, fn) => fn(val);

            modify(10, double);`
        );

        expect(result).toEqual(20);
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

    it('I can pass a function as an argument', async () => {
        const i = new JavascriptInterpreter();
        const result = i.run(`
            const add = (x, y) => x + y;

            const apply = (fn, arg1, arg2) => fn(arg1, arg2);

            apply(add, 20, 3);
        `);

        expect(result).toEqual(23);
    })

    it('can handle a conditional expression with a true condition', async () => {
        const i = new JavascriptInterpreter();
        const result = i.run("true ? 5 : 10");

        expect(result).toEqual(5);
    })

    it('can handle a conditional expression with a false condition', async () => {
        const i = new JavascriptInterpreter();
        const result = i.run("false ? 5 : 10");

        expect(result).toEqual(10);
    })

    it('can handle a conditional expression with a non-constant condition', async () => {
        const i = new JavascriptInterpreter();
        const result = i.run("!true ? 1 + 2 : 3 + 4");

        expect(result).toEqual(7);
    })

    it('can define an array constant', async () => {
        const i = new JavascriptInterpreter();
        const result = i.run("[1, 2, 3]");

        expect(result).toEqual([1, 2, 3]);
    })

    it('can define an array with expressions in it', async () => {
        const i = new JavascriptInterpreter();
        const result = i.run("[1, 2 + 3, -(10)]");

        expect(result).toEqual([1, 5, -10]);
    })

    it('can read an element from an array', () => {
        const i = new JavascriptInterpreter();
        const result = i.run(`
            const x = 1;
            [x, x+199, x+200][x]
        `);

        expect(result).toEqual(200);
    })

    it('can read an element from an array when the array is in a variable', () => {
        const i = new JavascriptInterpreter();
        const result = i.run(`
            const arr = [x, x+199, x+200];
            const x = 1;
            arr[x];
        `);

        expect(result).toEqual(200);
    })


    it('can define an object', () => {
        const i = new JavascriptInterpreter();
        const result = i.run(`
            const obj = { a: 1, b: 2 };
            obj;
        `);

        expect(result).toEqual({ a: 1, b: 2 });
    })

    it('can define an object with computed name and value', () => {
        const i = new JavascriptInterpreter();
        const result = i.run(`
            const obj = { ["a"]: 10-5 };
            obj;
        `);

        expect(result).toEqual({ a: 5 });
    })

    it('can read a member from an object', () => {
        const i = new JavascriptInterpreter();
        const result = i.run(`
            const obj = { a: 100 };
            obj.a;
        `);

        expect(result).toEqual(100);
    })

    it('can read a computed member from an object', () => {
        const i = new JavascriptInterpreter();
        const result = i.run(`
            const obj = { a: 100 };
            obj["a"];
        `);

        expect(result).toEqual(100);
    })

    it('can define a nested object', () => {
        const i = new JavascriptInterpreter();
        const result = i.run(`
            const obj = { a: { b: { c: 100 } } };
            obj;
        `);

        expect(result).toEqual({ a: { b: { c: 100 } } });
    })

    it('can define a nested array', () => {
        const i = new JavascriptInterpreter();
        const result = i.run(`
            const arr = [1, [2, [3, 4]]];
            arr;
        `);

        expect(result).toEqual([1, [2, [3, 4]]]);
    })

})