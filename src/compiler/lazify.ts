import { Node } from 'acorn'
import { isNode } from './isNode'
import { createReplacer, PLACEHOLDER1 } from './replacePlaceholder'

export function lazify(node: Node): Node {
    return visit(node, {
        Literal: (x) => LAZIFY(x),
        Program: null,
        ExpressionStatement: null,
        default: (n) => { throw "TBD: " + n.type }
    })
}

const LAZIFY = createReplacer(`LAZY(() => ${PLACEHOLDER1})`)

export function visit(node: Node, handlers: Record<string, ((x: Node) => Node) | null>): Node {
    if (!isNode(node)) {
        if (node == null || typeof node !== 'object') {
            return node
        } else if (Array.isArray(node)) {
            return (node as any).map((x: Node) => visit(x, handlers))
        }
    } else {
        const handler = handlers[node.type]
        if (handler != null) {
            // If it has a handler call it,
            return handler(node)
        } else if (handler === undefined) {
            // If it has a handler, but it's null, we'll use the default handler below
            // Otherwise, we'll use the specific default handler for this visitor
            const dflt = handlers.default
            if (dflt) {
                return dflt(node)
            }
        }
    }

    // In this case it's an object that takes the default behavior
    return Object.fromEntries(Object.entries(node).map(([key, value]) => [key, visit(value as any, handlers)])) as any
}