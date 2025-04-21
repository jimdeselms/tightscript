import { Parser } from 'acorn'
import * as E from '../expressions/exprs'

export function astToSExpression(expressionAst) {
    return toExpr(expressionAst)
}

function toExpr(ast) {
    switch (ast.type) {
        case 'Literal': return ast.value
        case 'BinaryExpression':
            const lhs = toExpr(ast.left), rhs = toExpr(ast.right)
            return BINARY_OPERATORS[ast.operator](lhs, rhs)
        default:
            throw new Error(`Unsupported AST node type: ${ast.type}`)
    }
}

const BINARY_OPERATORS = {
    '+': E.add,
    '-': E.sub,
    '*': E.mul,
    '/': E.div,
    '%': E.mod,
    '&&': E.and,
    '||': E.or,
    '==': E.eq,
    '!=': E.neq,
    '===': E.strictEq,
    '!==': E.strictNeq,
    '<': E.lt,
    '<=': E.lte,
    '>': E.gt,
    '>=': E.gte
}