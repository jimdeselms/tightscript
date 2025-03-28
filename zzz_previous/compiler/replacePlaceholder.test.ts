import { describe, it, expect } from 'vitest'

import { createReplacer, PLACEHOLDER1, PLACEHOLDER2 } from './replacePlaceholder'
import { Literal } from 'acorn'
import * as escodegen from 'escodegen'

describe('createReplacer', () => {
    it('can create a replacer that replaces placeholders', () => {
        const replacer = createReplacer(`"Hello, " + ${PLACEHOLDER1}`)

        const test = { type: 'Literal', value: 'world' } as Literal

        const ast = replacer(test)
        const code = escodegen.generate(ast)

        expect(code).toEqual("'Hello, ' + 'world'")
    })
})