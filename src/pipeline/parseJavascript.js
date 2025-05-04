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
        statements.push(nodeToSExpression(node))
    }

    return statements
}

function nodeToSExpression(node) {
    switch (node.type) {
        case 'ExpressionStatement':
            return nodeToSExpression(node.expression)
        case 'CallExpression':
            return [
                nodeToSExpression(node.callee),
                ...node.arguments.map(nodeToSExpression),
            ]
        case 'Identifier':
            return node.name
        case 'Literal':
            return node.value
        case 'BinaryExpression':
            return [
                primitiveFromOperator[node.operator],
                nodeToSExpression(node.left),
                nodeToSExpression(node.right),
            ]
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