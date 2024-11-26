import { Program, Node, parse, ArrayExpression, ExpressionStatement, UnaryExpression, ConditionalExpression, BinaryExpression, CallExpression, ObjectExpression, Property } from 'acorn'
import * as escodegen from 'escodegen'
import { createReplacer, PLACEHOLDER1, PLACEHOLDER2 } from './replacePlaceholder'
import { addSha } from './addSha'

export function compile(code: string): string {
    const ast = parse(code, {  ecmaVersion: 2020})
    addSha(ast)
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
            return CHECK_FOR_UNDEFINED(base, safe)
        case 'BinaryExpression':
            const left = updateAst((ast as BinaryExpression).left)
            const right = updateAst((ast as BinaryExpression).right)
            const safeBinary = {
                ...ast,
                left,
                right,
            } as BinaryExpression
            return CHECK_FOR_UNDEFINED(left, CHECK_FOR_UNDEFINED(right, safeBinary))
        case "CallExpression":
            const callee = updateAst((ast as CallExpression).callee)
            const safeCall = {
                ...ast,
                callee
            } as CallExpression
            return CHECK_FOR_UNDEFINED(callee, safeCall)
        case "ArrayExpression":
            const elements = (ast as ArrayExpression).elements.map(e => updateAst(e as Node))
            const arr = { ...ast, elements } as ArrayExpression
            return ANY_ARE_UNDEFINED(arr)
        case "ObjectExpression":
            const properties = (ast as ObjectExpression).properties.map(e => updateAst(e as Node))
            const obj = { ...ast, properties } as ObjectExpression
            return ANY_VALUES_ARE_UNDEFINED(obj)
        case "Property":
            const propKey = updateAst((ast as Property).key)
            const propValue = updateAst((ast as Property).value)
            const safeProp = { ...ast, key: propKey, value: propValue } as Property
            return { ...ast, 
                key: propKey, 
                propValue: CHECK_FOR_UNDEFINED(propValue, safeProp) } as any as Property
        case 'Identifier':
        case 'Literal':
            return ast
        default: throw `TBD - unknown type ${ast.type}`
    }
}

const CHECK_FOR_UNDEFINED: (baseExpr: Node, ifSafe: Node) => Node = createReplacer(`(${PLACEHOLDER1} === undefined ? undefined : ${PLACEHOLDER2})`)
const ANY_ARE_UNDEFINED: (arrayExpr: ArrayExpression) => Node = createReplacer(`(${PLACEHOLDER1}.some(e => e === undefined) ? undefined : ${PLACEHOLDER1})`)

// TODO - this isn't quite right; we shouldn't allow computed keys that are undefined, but Javascript doesn't have a way
// to do that: { [undefined]: 'xyz' } === { 'undefined': 'xyz' }
const ANY_VALUES_ARE_UNDEFINED: (objExpr: ObjectExpression) => Node = createReplacer(`(Object.values(${PLACEHOLDER1}).some(e => e === undefined) ? undefined : ${PLACEHOLDER1})`)