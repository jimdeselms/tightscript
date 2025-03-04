import { describe, it, expect } from 'vitest'
import { lexer } from './lexer'

describe('lexer', () => {
    it('can read punctuation characters and convert them into tokens', async () => {
        const inchars = toAsyncIterable('(', ')')
        const tokens = await fromAsyncIterable(lexer(inchars))
        const expected = [
            { kind: '(', text: '(' },
            { kind: ')', text: ')' },
        ]
        expect(tokens).toEqual(expected)        
    })

    it('can read digits and convert them into tokens and convert them into tokens', async () => {
        const inchars = toAsyncIterable('1', '2', '3')
        const tokens = await fromAsyncIterable(lexer(inchars))
        const expected = [
            { kind: 'number', text: '123' },
        ]
        expect(tokens).toEqual(expected)        
    })

    it('can read digits followed by punctuation and return two symbols', async () => {
        const inchars = toAsyncIterable('1', '2', '3', '(', )
        const tokens = await fromAsyncIterable(lexer(inchars))
        const expected = [
            { kind: 'number', text: '123' },
            { kind: '(', text: '(' },
        ]
        expect(tokens).toEqual(expected)        
    })

    it('can read id symbols', async () => {
        const inchars = toAsyncIterable('a', 'b', 'c', )
        const tokens = await fromAsyncIterable(lexer(inchars))
        const expected = [
            { kind: 'id', text: 'abc' },
        ]
        expect(tokens).toEqual(expected)        
    })


    it('can read id symbols that have numbers in them', async () => {
        const inchars = toAsyncIterable('a', '1', ' ', 'b', '2', )
        const tokens = await fromAsyncIterable(lexer(inchars))
        const expected = [
            { kind: 'id', text: 'a1' },
            { kind: 'id', text: 'b2' },
        ]
        expect(tokens).toEqual(expected)        
    })
})


async function* toAsyncIterable<T>(...iter: T[]): AsyncIterable<T> {
    for (let i of iter) {
        yield i
    }
}

async function fromAsyncIterable<T>(iter: AsyncIterable<T>): Promise<T[]> {
    const result: T[] = []
    for await (const i of iter) {
        result.push(i)
    }
    return result
}