export function isNode(x: any): x is Node {
    return typeof x === 'object' && x !== null && 'type' in x
}

export function isObject(x: any): x is Object {
    return typeof x === 'object' && x != null
}
