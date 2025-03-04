import { describe, it, expect } from 'vitest'

import { EvalState, evaluate, Expression, ExprFn, INITIAL_STATE } from './evaluate'

describe('evaluate', () => {
    it('should return null if there is no input expression', () => {
        evalNTimes(null, 1)
    })

    it('should return a token if the input expression is a token', () => {
        // i: [5],  ip: [], o: []
        // i: null, ip: [5], o: []
        // i: null, ip: [], o: [5]

        const state = evalNTimes(5, 3)
        expect(state.outputPrimitives).toEqual([5])
    })

    it('should convert a list to a reversed list of tokens', () => {
        const state = evalUntilDone(['add', 1, 2])
        expect(state.outputPrimitives).toEqual([2, 1, 'add'])
    })

    it('can handle a nested list', () => {
        const state = evalUntilDone(['add', 1, ['add', 2, 3]])
        expect(state.outputPrimitives).toEqual([3, 2, 'add', 1, 'add'])
    })

    it('can handle a doubly nested list', () => {
        const state = evalUntilDone(['sqrt', ['double', ['negate', 2]]])
        expect(state.outputPrimitives).toEqual([2, 'negate', 'double', 'sqrt'])
    })

    it('can handle a complex nested list', () => {
        const state = evalUntilDone(['sqrt', ['double', ['add', 1, ['negate', 5], ['negate', 2]]]])
        expect(state.outputPrimitives).toEqual([2, 'negate', 5, 'negate', 1, 'add', 'double', 'sqrt'])
    })
})

function evalNTimes(expr: Expression | null, n: number) {
    const state = INITIAL_STATE(expr)
    let next: ExprFn<EvalState> | null = evaluate

    for (let i = 0; i < n; i++) {
        expect(next).not.toBeNull()
        next = next!(state)
    }

    expect(next).toBeNull()

    return state
}

function evalUntilDone(expr: Expression | null) {
    const state = INITIAL_STATE(expr)
    let next: ExprFn<EvalState> | null = evaluate

    while (next) {
        next = next(state)
    }

    return state
}
