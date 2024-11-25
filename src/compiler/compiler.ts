import { Program, Node, parse, ExpressionStatement, UnaryExpression, ConditionalExpression, BinaryExpression, CallExpression } from 'acorn'
import * as escodegen from 'escodegen'
import { createReplacer, PLACEHOLDER1, PLACEHOLDER2 } from './replacePlaceholder'

export function compile(code: string): string {
    const ast = parse(code, {  ecmaVersion: 2020})
    const undefinedSafe = updateAst(ast)
    const generated = escodegen.generate(undefinedSafe)
    console.log(generated)
    return generated    
}

export function evaluate(expr: string): any {
    const code = compile(expr)

    return eval(code)
}

function updateAst(ast: Node): Node {
    switch (ast.type) {
        case 'Program':
            return {
                ...ast,
                body: (ast as Program).body.map(updateAst)
            } as Program
        case 'ExpressionStatement':
            return {
                ...ast,
                expression: updateAst((ast as ExpressionStatement).expression)
            } as ExpressionStatement
        case 'UnaryExpression':
            const base = updateAst((ast as UnaryExpression).argument)
            const safe = {
                ...ast,
                argument: base
            } as UnaryExpression
            return CHECK_FOR_UNDDEFINED(base, safe)
        case 'BinaryExpression':
            const left = updateAst((ast as BinaryExpression).left)
            const right = updateAst((ast as BinaryExpression).right)
            const safeBinary = {
                ...ast,
                left,
                right,
            } as BinaryExpression
            return CHECK_FOR_UNDDEFINED(left, CHECK_FOR_UNDDEFINED(right, safeBinary))
        case "CallExpression":
            const callee = updateAst((ast as CallExpression).callee)
            const safeCall = {
                ...ast,
                callee
            } as CallExpression
            return CHECK_FOR_UNDDEFINED(callee, safeCall)
        case 'Identifier':
        case 'Literal':
            return ast
        default: throw `TBD - unknown type ${ast.type}`
    }
}

const CHECK_FOR_UNDDEFINED: (baseExpr: Node, ifSafe: Node) => Node = createReplacer(`(${PLACEHOLDER1} === undefined ? undefined : ${PLACEHOLDER2})`)
