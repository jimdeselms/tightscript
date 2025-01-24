import { createVm, advanceVm } from './vm'
import { describe, it, expect } from 'vitest'

describe('vm', () => {
    it('can do stuff', () => {
        const vm = createVm(['read', 'write'])
        vm.inputQueue.push(42)
        advanceVm(vm)
        advanceVm(vm)
        expect(vm.outputQueue).toEqual([42])
    })
})