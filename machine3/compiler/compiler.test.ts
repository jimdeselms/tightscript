import { describe, expect, test } from 'vitest';

import { compile } from './compile'

describe('compile', () => {
    test('compiles a number', () => {
        const instructions = [42]
        const compiled = compile(instructions)
        const result = compiled()
        expect(result).toEqual(42)
    })

    test('compiles a string', () => {
        const instructions = ['"hello"']
        const compiled = compile(instructions)
        const result = compiled()
        expect(result).toEqual("hello")
    })

    test('compiles some simple instructions', () => {
        const instructions = [42, 'negate']
        const compiled = compile(instructions)
        const result = compiled()
        expect(result).toEqual(-42)
    })
})