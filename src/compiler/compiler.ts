import { Program, Node, parse, ExpressionStatement, UnaryExpression, ConditionalExpression } from 'acorn'
import * as escodegen from 'escodegen'

export function compile(code: string): string {
    const ast = parse(code, {  ecmaVersion: 2020})
    const undefinedSafe = updateAst(ast)
    const generated = escodegen.generate(undefinedSafe)
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
        case 'Identifier':
        case 'Literal':
            return ast
        default: throw `TBD - unknown type ${ast.type}`
    }
}

function checkForUndefined(baseExpr: Node, ifSafe: Node): Node {
    return {
        type: 'ConditionalExpression',
        test: {
            type: 'BinaryExpression',
            operator: '===',
            left: baseExpr,
            right: {
                type: 'Identifier',
                name: 'undefined'
            }
        },
        consequent: {
            type: 'Identifier',
            name: 'undefined'
        },
        alternate: ifSafe
    } as ConditionalExpression
}