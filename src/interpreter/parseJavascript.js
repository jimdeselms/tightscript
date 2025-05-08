import { parse } from 'acorn';

export function parseJavascript(text) {
    // Use acorn to get the ast for the text
    const ast = parse(text, {
        ecmaVersion: 2020,
        locations: true,
        ranges: true,
        sourceType: 'module',
    })

    if (ast.type !== 'Program') {
        throw new Error('Expected a Program node')
    }

    const statements = []

    for (let i = 0; i < ast.body.length; i++) {
        const node = ast.body[i]
        statements.push(...nodeToSExpressions(node))
    }

    return statements
}

// This function takes an AST node and converts it into one or more S-expressions.
// So, each branch returns an array of S-Expressions; don't be confused by the fact that
// the S-expressions themselves are arrays.
function nodeToSExpressions(node) {
    switch (node.type) {
        case 'ExpressionStatement':
            return nodeToSExpressions(node.expression)
        case 'Identifier':
            return [[ 'getvar', node.name ]]
        case 'ReturnStatement':
            return nodeToSExpressions(node.argument)
        case 'VariableDeclaration':
            {
                const res = node.declarations.map(e => nodeToSExpressions(e))
                return res.flat()
            }
        case 'VariableDeclarator':
            return [[ 'setvar', node.id.name, nodeToSExpressions(node.init)[0] ]]
        case 'Literal':
            return [ node.value ]
        case 'BinaryExpression':
            const result = [
                [ 
                    'resolve', 
                    [
                        primitiveFromOperator[node.operator],
                        nodeToSExpressions(node.left)[0],
                        nodeToSExpressions(node.right)[0],
                    ]
                ]
            ]
            return result

        case 'UnaryExpression':
            const unaryResult = [[
                'resolve',
                [
                    unaryPrimitivesFromOperator[node.operator],
                    nodeToSExpressions(node.argument)[0],
                ],
            ]]
            return unaryResult

        case 'ArrowFunctionExpression':
            return [[
                'fn',
                node.params.map(p => p.name),
                nodeToSExpressions(node.body)[0],
            ]]

        case 'BlockStatement':

            const statements = node.body.map(s => nodeToSExpressions(s)[0])

            return [[
                'block',
                ...statements,
            ]]

        case 'FunctionDeclaration':

            const body = nodeToSExpressions(node.body)

            return [[
                'setvar',
                node.id.name,
                [
                    'fn',
                    node.params.map(p => p.name),
                    body[0],
                ]
            ]]


        case 'CallExpression':
            return [[
                'call',
                nodeToSExpressions(node.callee)[0],
                ...node.arguments.map(e => nodeToSExpressions(e)[0]),
            ]]

        case 'ConditionalExpression':
            return [[
                'ifelse',
                nodeToSExpressions(node.test)[0],
                nodeToSExpressions(node.consequent)[0],
                nodeToSExpressions(node.alternate)[0],
            ]]

        default:
            throw new Error(`Unsupported node type: ${node.type}`)
    }
}

const primitiveFromOperator = {
    '+': 'add',
    '-': 'sub',
    '*': 'mul',
    '/': 'div'
}

const unaryPrimitivesFromOperator = {
    '-': 'negate',
    '!': 'not',
    '~': 'bitwiseNot'
}