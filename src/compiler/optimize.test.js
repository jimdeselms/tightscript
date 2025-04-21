import { Compiler } from './compile'
import { expr, parse, exprToString } from '../parse'
import { expect, it } from 'vitest'
import * as E from '../expressions/exprs'

describe('optimize', () => {
    it.each([
        [ "5", false ],
        [ "undefined", true ],
        [ "(negate $)", parse("(isUndefined (negate $))")]
    ])('can optimize isUndefined #%#', (expr, expected) => {
        const result = optimize(`(isUndefined ${expr})`)
        expect(result).toEqual(expected)
    })

    it.each([
        [ "5", false ],
        [ "undefined", false ],
        [ "(fn $)", true],
        [ "(fnref 1)", true],
        [ "(negate $)", parse("(isFunction (negate $))")]
    ])('can optimize isFunction #%#', (expr, expected) => {
        const result = optimize(`(isFunction ${expr})`)
        expect(result).toEqual(expected)
    })

    it.each([
        [ "5", true ],
        [ '"5"', false ],
        [ '"HI"', false ],
        [ true, false ],
        [ "undefined", false ],
        [ "(fn $)", false],
    ])('can optimize isNumber #%#', (expr, expected) => {
        const result = optimize(`(isNumber ${expr})`)
        expect(result).toEqual(expected)
    })

    it.each([
        [ "5", false ],
        [ '"5"', false ],
        [ '"HI"', false ],
        [ true, true ],
        [ "undefined", false ],
        [ "(fn $)", false],
    ])('can optimize isBoolean #%#', (expr, expected) => {
        const result = optimize(`(isBoolean ${expr})`)
        expect(result).toEqual(expected)
    })

    it.each([
        [ "5", false ],
        [ '"5"', true ],
        [ '"HI"', true ],
        [ true, false ],
        [ "undefined", false ],
        [ "(fn $)", false],
    ])('can optimize isString #%#', (expr, expected) => {
        const result = optimize(`(isString ${expr})`)
        expect(result).toEqual(expected)
    })

    it.skip('will not optimize pruned branches', () => {
        // It can't handle symbols, so this would blow up if the false branch weren't pruned
        const e = expr`(if true 1 ${ Symbol.for("FOO") })`
        const compiler = new Compiler()
        const result = compiler.optimize(e)
        expect(result).toEqual(1)
    })
})

function optimize(expr) {
    const compiler = new Compiler()
    const sExpr = parse(expr)
    return compiler.optimize(sExpr)
}