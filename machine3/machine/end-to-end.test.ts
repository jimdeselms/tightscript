// @ts-nocheck

import { describe, it, expect } from 'vitest';

import { expr } from './parse'
import { machine } from './machine'
import { compile } from '../compiler/compile'

describe('end-to-end tests', () => {
    it('can parse and return a number', () => {
        const sExpr = expr`10`
        const result = evaluate(sExpr)
        expect(result).toEqual(10)
    })

    it('can do a simple operation', () => {
        const sExpr = expr`(negateNumber 10)`
        const result = evaluate(sExpr)
        expect(result).toEqual(-10)
    })

    it('can check if a thing is a number', () => {
        const sExpr = expr`(isNumber 10)`
        const result = evaluate(sExpr)
        expect(result).toEqual(true)
    })

    it('can handle a conditional', () => {
        expect(evaluate(expr`(ifelse true 10 20)`)).toBe(10)
        expect(evaluate(expr`(ifelse false 10 20)`)).toBe(20)
    })
})

function evaluate(sExpression) {
    const instructions = machine(sExpression);
    const compiled = compile(instructions);
    const result = compiled();
    return result;
}