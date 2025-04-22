import { Parser } from 'acorn'
import * as E from '../expressions/exprs'

export function astToSExpression(expressionAst, state) {
    return toExpr(expressionAst, state)
}

function toExpr(ast, state) {
    switch (ast.type) {
        case 'Literal': return ast.value
        case 'BinaryExpression':
            const lhs = toExpr(ast.left), rhs = toExpr(ast.right)
            return [BINARY_OPERATORS[ast.operator], lhs, rhs]
        case 'UnaryExpression':
            const arg = toExpr(ast.argument)

            // It seems silly to have a whole negate expression for a negative literal; just make it a negative number.
            if (ast.operator === '-' && ast.argument.kind === 'Literal' && typeof ast.argument.value === 'number') {
                return -(ast.argument.value)
            }

            return UNARY_OPERATORS[ast.operator](arg)
        case 'ConditionalExpression':
            const cond = toExpr(ast.test)
            const ifTrue = toExpr(ast.consequent)
            const ifFalse = toExpr(ast.alternate)

            return E.ifte(cond, ifTrue, ifFalse)

        case 'Identifier':
            if (ast.name === 'undefined') {
                return undefined
            } else {
                throw "TBD - Identifier"
            }

        default:
            throw new Error(`Unsupported AST node type: ${ast.type}`)
    }
}

const BINARY_OPERATORS = {
    '+': 'add_safe',
    '-': 'sub_safe',
    '*': 'mul',
    '/': 'div',
    '==': 'eq',
    '===': 'eq',
    '<': 'lt',
    '<=': 'le',
    '>': 'gt',
    '>=': 'ge'
}

const UNARY_OPERATORS = {
    '-': E.negate,
}