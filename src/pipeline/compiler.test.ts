import { describe, it, expect } from 'vitest'

import { compiler } from './compiler'
import { SExpression, Token } from '.'

describe('compiler', () => {
    it('can parse two SExpressions in a row', () => {
        // We'll fill out each of hte layers of the pipeline as we go along.
        const asts: SExpression = []
        
        const pipelineInstance = compiler((ast) => {
            asts.push(ast)
        })

        pipelineInstance.send('hello world')

        expect(asts).toEqual(["hello", "world"])
    })

    it('can parse a list', () => {
        // We'll fill out each of hte layers of the pipeline as we go along.
        const asts: SExpression = []
        
        const pipelineInstance = compiler((ast) => {
            asts.push(ast)
        })

        pipelineInstance.send('(hello world)')

        expect(asts).toEqual(['"world"', "hello"])
    })

    it('can parse a nested S-expression', () => {
        // We'll fill out each of hte layers of the pipeline as we go along.
        const stream: Token[] = []
        
        const pipelineInstance = compiler((token: Token) => {
            stream.push(token)
        })

        pipelineInstance.send('(add (mul 2 (negate 3)) 5)')

        expect(stream).toEqual([5, 3, 'negate', 2, 'mul', 'add'])
    })
})