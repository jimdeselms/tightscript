import { Parser } from 'acorn'
import * as E from '../expressions/exprs'

export function astToSExpression(expressionAst) {
    return toExpr(expressionAst)
}

export class AstToSExpression {

    constructor(state) {
        this.state = state
    }
    
    toExpr(ast) {
        switch (ast.type) {
            case 'Literal': return ast.value
            case 'BinaryExpression':
                const lhs = this.toExpr(ast.left), rhs = this.toExpr(ast.right)
                return [BINARY_OPERATORS[ast.operator], lhs, rhs]
            case 'UnaryExpression':
                const arg = this.toExpr(ast.argument)

                // It seems silly to have a whole negate expression for a negative literal; just make it a negative number.
                if (ast.operator === '-' && ast.argument.kind === 'Literal' && typeof ast.argument.value === 'number') {
                    return -(ast.argument.value)
                }

                return UNARY_OPERATORS[ast.operator](arg)
            case 'ConditionalExpression':
                const cond = this.toExpr(ast.test)
                const ifTrue = this.toExpr(ast.consequent)
                const ifFalse = this.toExpr(ast.alternate)

                return E.ifte(cond, ifTrue, ifFalse)

            case 'Identifier':
                if (ast.name === 'undefined') {
                    return undefined
                } else {
                    const value = this.state.variables[ast.name]
                    if (value === undefined) {
                        throw new Error(`Undefined variable: ${ast.name}`)
                    }
                    return value
                }

            case 'VariableDeclaration':
                for (const decl of ast.declarations) {
                    this.toExpr(decl)
                }
                return undefined

            case 'VariableDeclarator':
                const name = ast.id.name
                const value = this.toExpr(ast.init)
                this.state.variables[name] = value

                return undefined

            case 'Program':
                for (const expr of ast.body) {
                    const result = this.toExpr(expr)
                    if (result !== undefined) {
                        return result
                    }
                }

                return undefined

            case 'ExpressionStatement':
                return this.toExpr(ast.expression)

            default:
                throw new Error(`Unsupported AST node type: ${ast.type}`)
        }
    }
}

const BINARY_OPERATORS = {
    '+': 'add_safe',
    '-': 'sub_safe',
    '*': 'mul_safe',
    '/': 'div_safe',
    '==': 'eq_safe',
    '===': 'eq_safe',
    '<': 'lt_safe',
    '<=': 'le_safe',
    '>': 'gt_safe',
    '>=': 'ge_safe'
}

const UNARY_OPERATORS = {
    '-': E.negate,
}