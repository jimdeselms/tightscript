import * as E from './expressions/index.js';

describe('expressions', () => {
    describe('literal', () => {
        it.each([
            ['5', 5],
            ['-5', -5],
            ['"hello"', 'hello'],
            ['true', true],
            ['false', false],
            ['null', null],
        ])('can compile literal %s', (expr, expected) => {
            const parsed = E.parse(expr)
            const result = parsed()
            expect(result).toEqual(expected)
        });
    })

    describe('add', () => {
        it.each([
            ['10', '20', 30],
        ])('can compile add %s', (lhs, rhs, expected) => {
            const parsed = E.parse(`(add ${lhs} ${rhs})`)
            const result = parsed()
            expect(result).toEqual(expected)
        });

        it.each([
            ['10', 'undefined'],
            ['undefined', '5'],
        ])('throws if you give it an undefined', (lhs, rhs) => {
            const parsed = E.parse(`(add ${lhs} ${rhs})`)
            expect(() => parsed([])).toThrow("UNDEFINED")
        })
    })
})