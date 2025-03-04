import { describe, it, expect } from 'vitest'

import { SerializeState, serialize, Expression, INITIAL_STATE } from './serialize'
import { ExprFn } from '.'

describe('serialize', () => {
    it('should return null if there is no input expression', () => {
        serializeUntilDone(null)
    })

    it('should return a token if the input expression is a token', () => {
        // i: [5],  ip: [], o: []
        // i: null, ip: [5], o: []
        // i: null, ip: [], o: [5]

        const state = serializeUntilDone(5)
        expect(state.primitives).toEqual([5])
    })

    it('should convert a list to a reversed list of tokens', () => {
        const state = serializeUntilDone(['add', 1, 2])
        expect(state.primitives).toEqual([2, 1, 'add'])
    })

    it('can handle a nested list', () => {
        const state = serializeUntilDone(['add', 1, ['add', 2, 3]])
        expect(state.primitives).toEqual([3, 2, 'add', 1, 'add'])
    })

    it('can handle a doubly nested list', () => {
        const state = serializeUntilDone(['sqrt', ['double', ['negate', 2]]])
        expect(state.primitives).toEqual([2, 'negate', 'double', 'sqrt'])
    })

    it('can handle a complex nested list', () => {
        const state = serializeUntilDone(['sqrt', ['double', ['add', 1, ['negate', 5], ['negate', 2]]]])
        expect(state.primitives).toEqual([2, 'negate', 5, 'negate', 1, 'add', 'double', 'sqrt'])
    })
})

function serializeUntilDone(expr: Expression | null) {
    const state = INITIAL_STATE(expr)
    let next: ExprFn<SerializeState> | null = serialize

    while (next) {
        next = next(state)
    }

    return state
}
