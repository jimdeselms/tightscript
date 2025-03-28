import { Node } from 'acorn'

export function isNode(x: any): x is Node {
    return x != null && typeof x === 'object' && 'type' in x
}
