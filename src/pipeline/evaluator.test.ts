import { describe, it, expect } from 'vitest'
import { Token } from '.'
import { evaluator } from './evaluator'

describe('evaluator', () => {
    it('can evaluate', () => {
        const tokens: Token[] = []

        const pipelineInstance = evaluator((token) => {
            tokens.push(token)  
        })

        pipelineInstance.send(123)

        expect(tokens).toEqual([123])
    })
})