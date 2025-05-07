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

function nodeToSExpressions(node) {
    switch (node.type) {
        case 'ExpressionStatement':
            return nodeToSExpressions(node.expression)
        case 'Identifier':
            return [[ 'getvar', node.name ]]
        case 'ReturnStatement':
            return nodeToSExpressions(node.argument)[0]
        case 'VariableDeclaration':
            {
                const res = node.declarations.map(nodeToSExpressions)
                return res[0]
            }
        case 'VariableDeclarator':
            return [[ 'setvar', node.id.name, nodeToSExpressions(node.init)[0] ]]
        case 'Literal':
            return [ node.value ]
        case 'BinaryExpression':
            const result = [[
                primitiveFromOperator[node.operator],
                nodeToSExpressions(node.left)[0],
                nodeToSExpressions(node.right)[0],
            ]]
            return result

        case 'UnaryExpression':
            const unaryResult = [[
                unaryPrimitivesFromOperator[node.operator],
                nodeToSExpressions(node.argument)[0],
            ]]
            return unaryResult

        case 'ArrowFunctionExpression':
            return [[
                'fn',
                node.params.map(p => p.name),
                nodeToSExpressions(node.body)[0],
            ]]

        case 'BlockStatement':
            const statements = node.body.map(nodeToSExpressions)

            return statements

        case 'FunctionDeclaration':
            return [[
                'setvar',
                node.id.name,
                [
                    'fn',
                    node.params.map(p => p.name),
                    nodeToSExpressions(node.body)[0],
                ]
            ]]


        case 'CallExpression':
            return [[
                'call',
                nodeToSExpressions(node.callee)[0],
                ...node.arguments.map(e => nodeToSExpressions(e)[0]),
            ]]

        default:
            throw new Error(`Unsupported node type: ${node.type}`)
    }
}

const primitiveFromOperator = {
    '+': 'add-safe',
    '-': 'sub-safe',
    '*': 'mul-safe',
    '/': 'div-safe'
}

const unaryPrimitivesFromOperator = {
    '-': 'negate-safe',
    '!': 'not-safe',
    '~': 'bitwiseNot-safe'
}