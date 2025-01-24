import { describe, it, expect } from 'vitest'

import { I, Machine } from './machine'

describe('machine', () => {
    it('can return the number on the top of the stack by stepping', () => {
        const instructions = [I.int, 100, I.halt]

        const machine = new Machine(instructions)
        while (machine.step()) {}

        expect(machine.top()).toBe(100)
    })

    it('can return the number on the top of the stack by running', () => {
        const instructions = [I.int, 100, I.halt]

        const machine = new Machine(instructions)
        const result = machine.run()

        expect(result).toBe(100)
    })

    it('it can jump to an instruction', () => {
        const machine = new Machine([I.jmp, 3, I.halt, I.int, 111, I.halt])
        const result = machine.run()
        expect(result).toBe(111)
    })

    it('will go to the first address if the value on top of the stack is non-zero', () => {
        const machine = new Machine([I.int, 1, I.if, 5, 8, I.int, 50, I.halt, I.int, 100, I.halt])
        const result = machine.run()
        expect(result).toBe(50)
    })

    it('will go to the second address if the value on top of the stack is zero', () => {
        const machine = new Machine([I.int, 0, I.if, 5, 8, I.int, 50, I.halt, I.int, 100, I.halt])
        const result = machine.run()
        expect(result).toBe(100)
    })

    it('can add two numbers', () => {
        const machine = new Machine([I.int, 10, I.int, 20, I.add, I.halt])
        const result = machine.run()
        expect(result).toBe(30)
    })
})