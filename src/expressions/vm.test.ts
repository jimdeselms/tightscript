import { describe, it, expect } from 'vitest'
import { VM } from './vm'

describe('VM', () => {
    it('can do simple things', () => {
        const vm = new VM([5, 3, 'add', 'halt'], {
            add: (vm) => {
                const a = vm.pop() as number
                const b = vm.pop() as number
                vm.push(a + b)
            }
        }, {})

        const result = vm.run()
        expect(result).toBe(8)
    })
})