import { describe, it, expect } from 'vitest'

import { expressionToVm } from './expressionToVm'
import { VM } from './vm'

describe('expressionToVm', () => {
    it('can convert an S-expression to VM instructions', () => {
        const expr = ['add', 1, ['add', 2, 3]]
        const instructions = expressionToVm(expr)
        const vm = new VM(instructions, {
            add: (vm) => {
                const a = vm.pop() as number
                const b = vm.pop() as number
                vm.push(a + b)
            }
        }, {})

        const result = vm.run()

        expect(result).toBe(6)
    })
})