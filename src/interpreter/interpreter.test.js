import { Interpreter } from './interpreter.js';
import { createHandlers } from './handlers.js';

describe('Interpreter', () => {
    it('can evaluate a number', () => {
        const interpreter = new Interpreter(createHandlers);
        const result = interpreter.run(10);
        expect(result).toEqual(10);
    });

    it('can evaluate a string', () => {
        const interpreter = new Interpreter(createHandlers);
        const result = interpreter.run('hello');
        expect(result).toEqual('hello');
    });

    it('can evaluate a boolean', () => {
        const interpreter = new Interpreter(createHandlers);
        const result = interpreter.run(true);
        expect(result).toEqual(true);
    });

    it('can evaluate null', () => {
        const interpreter = new Interpreter(createHandlers);
        const result = interpreter.run(null);
        expect(result).toEqual(null);
    });

    it('can evaluate undefined', () => {
        const interpreter = new Interpreter(createHandlers);
        const result = interpreter.run(undefined);
        expect(result).toEqual(undefined);
    });

    it('can negate a number', () => {
        const interpreter = new Interpreter(createHandlers);
        const result = interpreter.run(['negate', 5]);
        expect(result).toEqual(-5);
    })
})