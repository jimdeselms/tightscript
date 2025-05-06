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
        case 'CallExpression':
            return [[
                nodeToSExpressions(node.callee),
                ...node.arguments.map(nodeToSExpressions),
            ]]
        case 'Identifier':
            return [[ 'getvar', node.name ]]
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