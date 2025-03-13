import { describe, it, expect } from 'vitest'
import { conditionalMachine } from './conditionalMachine'
import { createSymbolMachine } from './symbolMachine'

describe('compileSExpression', () => {
    it('constant expression', () => {
        const output = []

        const machine = conditionalMachine(tok => output.push(tok))

        machine(5, 'out', 'halt')

        expect(output).toEqual([5])
    })

    it('externally-handled conditions', () => {
        const output = []

        const machine = conditionalMachine(tok => output.push(tok))

        machine(-5, 0, 'lt', 'out', 'halt')

        expect(output).toEqual([true])
    })


    it('list of toekns', () => {
        const output = []

        const machine = conditionalMachine(tok => output.push(tok))

        machine([-5, 0, 'lt', 'out', 'halt'])

        expect(output).toEqual([true])
    })

    it('iftrue with single value', () => {
        const output = []

        const machine = conditionalMachine(tok => output.push(tok))

        machine(true, 'iftrue', 1, 'out', 'halt')

        expect(output).toEqual([1])
    })

    it('iftrue with single value when it is false', () => {
        const output = []

        const machine = conditionalMachine(tok => output.push(tok))

        machine(2, false, 'iftrue', 1, 'out', 'halt')

        expect(output).toEqual([2])
    })

    it('iftrue with complex value', () => {
        const output = []

        const machine = conditionalMachine(tok => output.push(tok))

        machine(true, 'iftrue', [-5, 0, 'lt'], 'out', 'halt')

        expect(output).toEqual([true])
    })

    it('iftrue with complex value when false', () => {
        const output = []

        const machine = conditionalToSymbolic(tok => output.push(tok))

        machine(false, 'iftrue', [-5, 0, 'lt'], 'out', 'halt')

        expect(output).toEqual([ undefined ])
    })

    it('iffalse with single value', () => {
        const output = []

        const machine = conditionalMachine(tok => output.push(tok))

        machine(false, 'iffalse', 1, 'out', 'halt')

        expect(output).toEqual([1])
    })

    it('iffalse with compex value', () => {
        const output = []

        const machine = conditionalMachine(tok => output.push(tok))

        machine(true, 'iffalse', [-5, 0, 'lt'], 'out', 'halt')

        expect(output).toEqual([undefined])
    })

    it('nested conditional 1', () => {
        const output = []

        const machine = conditionalMachine(tok => output.push(tok))

        machine(true, 'iftrue', [false, 'iffalse', 123], 'out', 'halt')

        expect(output).toEqual([123])
    })

    it('nested conditional 2', () => {
        const output = []

        const machine = conditionalMachine(tok => output.push(tok))

        machine(false, 'iffalse', [false, 'iffalse', [10]], 'out', 'halt')

        expect(output).toEqual([10])
    })
})
