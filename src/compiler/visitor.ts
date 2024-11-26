import { Node } from 'acorn'

type VisitorFn<TArgs extends any[]> = (node: Node, ...args: TArgs) => Node

export function visitor<TArgs extends any[]>(
    handlers: Record<string, VisitorFn<TArgs>>
) : VisitorFn<TArgs> {

    const fn: VisitorFn<TArgs> = (node: Node, ...args: TArgs) => {
        if (typeof node !== 'object' || node === null) {
            return node
        }

        if (isNode(node)) {
            const handler = handlers[node.type]
            if (handler) {
                return handler(node, ...args)
            }
        }

        const handler = handlers[node.type]
        if (handler) {
            const result = handler(node, ...args)
            if (result !== undefined) {
                return result
            }
        }

        return Object.fromEntries(Object.entries(node).map(([key, value]) => {
            if (Array.isArray(value)) {
                return [key, value.map(v => fn(v, ...args))]
            } else {
                return [key, fn(value, ...args)]
            }
        }))
    }

    return fn
}

function isNode(x: any): x is Node {
    return typeof x === 'object' && x !== null && 'type' in x
}