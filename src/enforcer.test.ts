import { describe, it, expect } from 'vitest'
import * as Enforcer from './enforcer'


describe('enforcer', () => {
    it('can validate a number that is valid', () => {
        const nonDefaultResult = Enforcer.validate(50, Enforcer.Number)
        expect(nonDefaultResult).toBe(50)
    })

    it('can validate a number that is valid', () => {
        const nonDefaultResult = Enforcer.validate(50, Enforcer.Number)
        expect(nonDefaultResult).toBe(50)
    })

    it('can add a default to an existing predicate', () => {
        const numWithDefault = Enforcer.extend(Enforcer.Number, {
            default: 0
        })

        const nonDefaultResult = Enforcer.validate(50, numWithDefault)
        expect(nonDefaultResult).toBe(50)

        const defaultresult = Enforcer.validate(null, numWithDefault)
        expect(defaultresult).toBe(0)
    })

    it('it can adjust a value that is not valid', () => {
        const numOrString = Enforcer.extend(Enforcer.Number, {
            adjust: (x) => {
                if (typeof x === 'string') {
                    const parsed = parseFloat(x)
                    if (!isNaN(parsed)) {
                        return parsed
                    }
                }
                return undefined
            }
        })

        const adjusted = Enforcer.validate('50', numOrString)
        expect(adjusted).toBe(50)
    })

    it('can compose more complex types', () => {
        const isPerson = Enforcer.ObjectGuard({
            name: Enforcer.String,
            age: Enforcer.Number
        })

        type Person = Enforcer.TypeGuardType<typeof isPerson>
        const person: Person = {
            name: 'Fred',
            age: 50
        }

        
    })
})