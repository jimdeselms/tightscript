import { describe, it, expect } from 'vitest'
import { createSymbolMachine } from './symbolMachine'

describe('compileSExpression', () => {
    it('constant expression', () => {
        const output = []

        const [send, state] = createSymbolMachine(tok => output.push(tok))

        send(5, 'out', 'halt')

        expect(state.publicState.halt).toBe(true)
        expect(output).toEqual([5])
    })

    it('externally-handled conditions', () => {
        const output = []

        const [send, state] = createSymbolMachine(tok => output.push(tok))

        send(-5, 0, 'lt')

        expect(state.stack[state.stack.length-1]).toBe(true)
    })
})