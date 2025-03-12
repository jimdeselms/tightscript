import { describe, it, expect } from 'vitest'
import { createSymbolMachine } from './symbolMachine'

describe('compileSExpression', () => {
    it('constant expression', () => {
        const output = []

        const machine = createSymbolMachine(tok => output.push(tok))

        machine.send(5, 'out', 'halt')

        expect(machine.state.halt).toBe(true)
        expect(output).toEqual([5])
    })

    it('externally-handled conditions', () => {
        const output = []

        const machine = createSymbolMachine(tok => output.push(tok))

        machine.send(-5, 0, 'lt')

        expect(machine.topOfStack).toBe(true)
    })
})