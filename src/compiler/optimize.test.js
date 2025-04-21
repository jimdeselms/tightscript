import { Compiler } from './compile'
import { expr, parse, exprToString } from '../parse'
import { expect, it } from 'vitest'
import * as E from '../expressions/exprs'

describe('optimize', () => {
    it('can optimize isUndefined if its argument is literal', () => {
        const result = optimize("(isUndefined 5)")
        expect(result).toBe(false)
    })
})

function optimize(expr) {
    const compiler = new Compiler()
    const sExpr = parse(expr)
    return compiler.optimize(sExpr)
}