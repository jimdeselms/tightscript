import { parse } from 'acorn'
import * as escodegen from 'escodegen'
import { createReplacer, PLACEHOLDER1 } from './replacePlaceholder'
import { BUILTINS } from './BUILTINS'

const WRAP_WITH_FUNCTION_WITH_BUILTINS = createReplacer(
    `(() => {
        ${BUILTINS}
        return ${PLACEHOLDER1}
    })`)

export function compile(code: string): string {
    const ast = parse(code, { ecmaVersion: 2023 })

    const asFunction = WRAP_WITH_FUNCTION_WITH_BUILTINS(ast)

    const compiled = escodegen.generate(asFunction)

    console.log(compiled)

    return compiled
}