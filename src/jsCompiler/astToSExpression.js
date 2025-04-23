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

                return [UNARY_OPERATORS[ast.operator], arg]
            case 'ConditionalExpression':
                const cond = this.toExpr(ast.test)
                const ifTrue = this.toExpr(ast.consequent)
                const ifFalse = this.toExpr(ast.alternate)

                return ['if_safe', cond, ifTrue, ifFalse]

            case 'Identifier':
                if (ast.name === 'undefined') {
                    return undefined
                } else {
                    for (let i = 0; i < this.state.scopes.length; i++) {
                        const value = this.state.scopes[i][ast.name]
                        if (value !== undefined) {
                            return value
                        }
                    }

                    throw new Error(`Undefined variable: ${ast.name}`)
                }

            case 'VariableDeclaration':
                for (const decl of ast.declarations) {
                    this.toExpr(decl)
                }
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

            case 'FunctionDeclaration': {
                const ordinal = this.state.functions.length
                const id = ast.id.name
                this.state.scopes[0][id] = ['fnref', ordinal]

                const params = ast.params.map((param) => param.name)
                for (let i = 0; i < params.length; i++) {
                    this.state.scopes[0][params[i]] = ['arg', i]
                }

                this.state.functions[ordinal] = ['fn', this.toExpr(ast.body)]

                return undefined
            }

            case 'ArrowFunctionExpression': {
                const ordinal = this.state.functions.length
                this.state.scopes.unshift({})

                const params = ast.params.map((param) => param.name)
                for (let i = 0; i < params.length; i++) {
                    this.state.scopes[0][params[i]] = ['arg', i]
                }

                this.state.functions[ordinal] = ['fn', this.toExpr(ast.body)]

                this.state.scopes.shift()

                return ['fnref', ordinal]
            }

            case 'VariableDeclarator':
                const name = ast.id.name
                const value = this.toExpr(ast.init)
                this.state.scopes[0][name] = value

                return undefined

            case 'BlockStatement':
                this.state.scopes.unshift({})
                let result

                for (const stmt of ast.body) {
                    result = this.toExpr(stmt)
                    if (result !== undefined) {
                        break
                    }
                }

                this.state.scopes.shift()

                return result

            case 'ReturnStatement':
                const returnValue = this.toExpr(ast.argument)
                return returnValue

            case 'CallExpression':
                const fn = this.toExpr(ast.callee)
                const args = ast.arguments.map((arg) => this.toExpr(arg))
                return ['call', fn, ...args]

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
    '-': 'negate_safe',
}