import { describe, it, expect } from 'vitest'

import { compiler } from './compiler'
import { SExpression } from '.'

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

        expect(asts).toEqual([["hello", "world"]])
    })

    it('can parse a nested S-expression', () => {
        // We'll fill out each of hte layers of the pipeline as we go along.
        const asts: SExpression = []
        
        const pipelineInstance = compiler((ast) => {
            asts.push(ast)
        })

        pipelineInstance.send('(hello (world ()))')

        expect(asts).toEqual([["hello", ["world", []]]])
    })

    it('can parse an expression in chunks', () => {
        // We'll fill out each of hte layers of the pipeline as we go along.
        const asts: SExpression = []
        
        const pipelineInstance = compiler((ast) => {
            asts.push(ast)
        })

        pipelineInstance.send('(hello')
        pipelineInstance.send('(world')
        pipelineInstance.send('()))')

        expect(asts).toEqual([["hello", ["world", []]]])
    })
})