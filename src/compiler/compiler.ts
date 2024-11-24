import { Program, Node, parse, ExpressionStatement, UnaryExpression, ConditionalExpression, BinaryExpression } from 'acorn'
import * as escodegen from 'escodegen'
import { createReplacer, PLACEHOLDER_ID } from './replacePlaceholder'

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
            return checkForUndefined(base, safe)
        case 'BinaryExpression':
            const left = updateAst((ast as BinaryExpression).left)
            const right = updateAst((ast as BinaryExpression).right)
            const safeBinary = {
                ...ast,
                left,
                right,
            } as BinaryExpression
            return checkForUndefined(left, checkForUndefined(right, safeBinary))
        case 'Identifier':
        case 'Literal':
            return ast
        default: throw `TBD - unknown type ${ast.type}`
    }
}

const EQUAL_TO_UNDEFINED = createReplacer(`(${PLACEHOLDER_ID} === undefined)`)

function checkForUndefined(baseExpr: Node, ifSafe: Node): Node {
    return {
        type: 'ConditionalExpression',
        test: EQUAL_TO_UNDEFINED(baseExpr),
        consequent: {
            type: 'Identifier',
            name: 'undefined'
        },
        alternate: ifSafe
    } as ConditionalExpression
}