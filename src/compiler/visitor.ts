import { Node } from 'acorn'
import { isNode } from "./isNode"

export type VisitorHandler<TNode extends Node=Node, TArgs extends any[]=[]> = (node: TNode, ...args: TArgs) => TNode

export function createVisitor<TNode extends Node=Node, TArgs extends any[]=[]>(
    handlers: Record<string, VisitorHandler | null>
): VisitorHandler<TNode, TArgs> {
    const visitor = (node: TNode, ...args: TArgs) => {
        if (!isNode(node)) {
            if (node == null || typeof node !== 'object') {
                return node
            } else if (Array.isArray(node)) {
                return (node as any).map((x: TNode) => visitor(x, ...args)) 
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
        return Object.fromEntries(Object.entries(node).map(([key, value]: [string, TNode]): [string, TNode] => {
            return [key, visitor(value, ...args)]
        }))
    }

    return visitor
}
