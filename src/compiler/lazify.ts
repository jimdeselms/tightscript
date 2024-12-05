import { BinaryExpression, Expression, Node } from 'acorn'
import { createReplacer, PLACEHOLDER1 } from './replacePlaceholder'
import { createVisitor } from './visitor'

export const lazify = createVisitor<Node, []>({
    Literal: (x: Node) => LAZIFY(x),
    BinaryExpression: handleBinary,
    LogicalExpression: handleBinary,
    Program: null,
    ExpressionStatement: null,
    default: (n: Node) => { throw "TBD: " + n.type }
})

function handleBinary(x: Node) {
    const binary = x as BinaryExpression
    const left = lazify(binary.left)
    const right = lazify(binary.right)

    const result: BinaryExpression = { 
        ...binary, 
        left: UNWRAPPED(left), 
        right: UNWRAPPED(right) }

    return LAZIFY(result)
}

const LAZIFY = createReplacer<Expression>(`LAZY(() => ${PLACEHOLDER1})`)
const UNWRAPPED = createReplacer<Expression>(`((${PLACEHOLDER1})())`)

