import { describe, it, expect } from 'vitest'
import { symbolicExpander } from './conditionalMachine'
import { createSymbolMachine } from './symbolMachine'

describe('compileSExpression', () => {
    it('constant expression', () => {
        const output = []

        const machine = conditionalToSymbolic(tok => output.push(tok))

        machine(5, 'out', 'halt')

        expect(output).toEqual([5])
    })

    it('externally-handled conditions', () => {
        const output = []

        const machine = conditionalToSymbolic(tok => output.push(tok))

        machine(-5, 0, 'lt', 'out', 'halt')

        expect(output).toEqual([true])
    })


    it('list of toekns', () => {
        const output = []

        const machine = conditionalToSymbolic(tok => output.push(tok))

        machine([-5, 0, 'lt', 'out', 'halt'])

        expect(output).toEqual([true])
    })

    it('iftrue with single value', () => {
        const output = []

        const machine = conditionalToSymbolic(tok => output.push(tok))

        machine(true, 'iftrue', 1, 'out', 'halt')

        expect(output).toEqual([1])
    })

    it('iftrue with single value when it is false', () => {
        const output = []

        const machine = conditionalToSymbolic(tok => output.push(tok))

        machine(2, false, 'iftrue', 1, 'out', 'halt')

        expect(output).toEqual([2])
    })

    it('iftrue with complex value', () => {
        const output = []

        const machine = conditionalToSymbolic(tok => output.push(tok))

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

        const machine = conditionalToSymbolic(tok => output.push(tok))

        machine(false, 'iffalse', 1, 'out', 'halt')

        expect(output).toEqual([1])
    })

    it('iffalse with compex value', () => {
        const output = []

        const machine = conditionalToSymbolic(tok => output.push(tok))

        machine(true, 'iffalse', [-5, 0, 'lt'], 'out', 'halt')

        expect(output).toEqual([undefined])
    })
})

function conditionalToSymbolic(onOutputSymbol) {

    let conditionalMode = null
    let captureNext = false
    let captured = null
    let skipNext = false

    const s = createSymbolMachine(sym => {
        if (conditionalMode) {
            skipNext = conditionalMode === 'iftrue' ? !sym : sym
            conditionalMode = null
        } else {
            onOutputSymbol(sym)
        }
    })

    const state = s[1]
    const symbolMachine = s[0]

    const expander = symbolicExpander(sym => symbolMachine(sym))

    return (...symbols) => {
        let innerState = state

        for (const sym of symbols) {
            if (skipNext) {
                skipNext = false
                continue
            }

            if (sym === 'iftrue') {
                conditionalMode = 'iftrue'
                symbolMachine('out')
            } else if (sym === 'iffalse') {
                conditionalMode = 'iffalse'
                symbolMachine('out')
            } else {
                expander(sym)
            }
        }
    }
}