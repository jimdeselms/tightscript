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

        expect(tokens).toEqual([123])
    })

    it('can evaluate a simple string', () => {
        const tokens: Token[] = []

        const pipelineInstance = evaluator((token) => {
            tokens.push(token)  
        })

        pipelineInstance.send("Hello")

        expect(tokens).toEqual(["Hello"])
    })
})