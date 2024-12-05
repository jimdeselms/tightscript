import { Expression, parse, VariableDeclaration, VariableDeclarator } from 'acorn'
import * as escodegen from 'escodegen'
import { createReplacer, PLACEHOLDER1 } from './replacePlaceholder'
import { BUILTINS } from './BUILTINS'
import { lazify, LazifyCtx } from './lazify'
import { getVariableName } from './getVariableName'

const WRAP_WITH_FUNCTION_WITH_BUILTINS = createReplacer(
    `(() => {
        ${BUILTINS}
        return ${PLACEHOLDER1}
    })()`)

export function compile(code: string): string {
    const ast = parse(code, { ecmaVersion: 2023 })

    const ctx = {
        variables: [],
        shas: new Map<string, number>()
    }

    const lazified = lazify(ast as any as Expression, ctx)

    const asFunction = WRAP_WITH_FUNCTION_WITH_BUILTINS(lazified)

    const declarators = getVariableDeclarators(ctx)

    // We reference all the expressions with variables, so let's create the declarations for those variables
    const declaration: VariableDeclaration = {
        type: "VariableDeclaration",
        start: 0,
        end: 0,
        declarations: declarators,
        kind: "const"
    }

    const fnBody = (asFunction as any).callee.body
    fnBody.body.unshift(declaration)

    const compiled = escodegen.generate(asFunction)

    console.log(compiled)

    return compiled
}

function getVariableDeclarators(ctx: LazifyCtx): VariableDeclarator[] {
    return ctx.variables.map((expr, i) => {
        const variableName = getVariableName(i)
        return {
            type: 'VariableDeclarator',
            id: { type: 'Identifier', name: variableName },
            init: expr,
        } as VariableDeclarator
    })
}