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
})