import { describe, it, expect } from 'vitest'
import { Guard } from './index'

describe('Type Guards', () => {
    it('isString', () => {
        const isString = Guard.String
        expect(isString('5')).toBe(true)
        expect(isString(5)).toBe(false)
    })

    it('isBoolean', () => {
        const isBoolean = Guard.Boolean
        expect(isBoolean(true)).toBe(true)
        expect(isBoolean(false)).toBe(true)
        expect(isBoolean(5)).toBe(false)
    })

    it('isDefined', () => {
        const isDefined = Guard.Defined
        expect(isDefined(undefined)).toBe(false)
        expect(isDefined(null)).toBe(false)
        expect(isDefined(5)).toBe(true)
    })

    it('tuple', () => {
        const isStringNumPair = Guard.Tuple(Guard.String, Guard.Number)
        expect(isStringNumPair(['5', 5])).toBe(true)
    })

    it('toObjectGuard', () => {
        const guard = Guard.Object({
            a: Guard.Number,
            b: {
                c: Guard.String,
                d: Guard.Boolean,
            },
        })

        const obj = {
            a: 5,
            b: {
                c: 'hello',
                d: true,
            },
        }

        expect(guard(obj)).toBe(true)

        const x: Guard.TypeofGuard<typeof guard> = obj
    })
})