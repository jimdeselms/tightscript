import { describe, it, expect } from 'vitest'

import { evaluate, EvaluationState, Token, INITIAL_STATE } from './evaluate'
import { ExprFn } from '.'

describe('evaluate', () => {
    it('should return an empty stack if there are no inputs', () => {
        const state = serializeUntilDone()
        expect(state.stack).toEqual([])
    })

    it('should push numbers onto the stack', () => {
        const state = serializeUntilDone(1, 2, 3)
        expect(state.stack).toEqual([1, 2, 3])
    })

    it('can evaluate a primitive', () => {
        const state = serializeUntilDone(2, 1, 'add')
        expect(state.stack).toEqual([3])
    })
})

function serializeUntilDone(...primitives: Token[]) {
    const state = INITIAL_STATE(...primitives)
    let next: ExprFn<EvaluationState> | null = evaluate

    while (next) {
        next = next(state)
    }

    return state
}
