import { describe, it, expect } from 'vitest'
import { Token } from '.'
import { evaluator } from './evaluator'

describe('evaluator', () => {
    it('can evaluate a simple number', () => {
        const tokens: Token[] = []

        const pipelineInstance = evaluator((token) => {
            tokens.push(token)  
        })

        pipelineInstance.send(123)
        pipelineInstance.send('out')

        expect(tokens).toEqual([123])
    })

    it('can evaluate a simple string', () => {
        const tokens: Token[] = []

        const pipelineInstance = evaluator((token) => {
            tokens.push(token)  
        })

        pipelineInstance.send('"Hello"')
        pipelineInstance.send('out')

        expect(tokens).toEqual(["Hello"])
    })

    it('can evaluate a simple expression', () => {
        const tokens: Token[] = []

        const pipelineInstance = evaluator((token) => {
            tokens.push(token)  
        })

        pipelineInstance.send(5)
        pipelineInstance.send('negate')
        pipelineInstance.send('out')

        expect(tokens).toEqual([-5])
    })

    it('subtracting numbers', () => {
        const tokens: Token[] = []

        const pipelineInstance = evaluator((token) => {
            tokens.push(token)  
        })

        pipelineInstance.send(2)
        pipelineInstance.send(5)
        pipelineInstance.send('sub')
        pipelineInstance.send('out')

        expect(tokens).toEqual([3])
    })

    it('adding numbers', () => {
        const tokens: Token[] = []

        const pipelineInstance = evaluator((token) => {
            tokens.push(token)  
        })

        pipelineInstance.send(2)
        pipelineInstance.send(5)
        pipelineInstance.send('add')
        pipelineInstance.send('out')

        expect(tokens).toEqual([7])
    })
})