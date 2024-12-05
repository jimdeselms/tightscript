import * as crypto from 'crypto'
import { Node } from 'acorn'

type MapWithLength = Map<string, [string, Node]> & { count: number }

import { isNode, isObject } from './isNode'

export function addSha(node: Node, variables: MapWithLength): void {
    if (!isObject(node)) {
        return node        
    }

    if (isNode(node)) {
        (node as any).sha = getSha(node, variables)
    }
}

function getSha(node: Node, variables: MapWithLength): string {
    if (isNode(node) && 'sha' in node) {
        return node.sha as string
    }

    if (!isObject(node)) {
        return getShaFromString(JSON.stringify(node))
    }

    const sha = getShaFromAny(node, variables);
    (node as any).sha = sha
    setVarname(node, sha, variables)

    return sha
}

function getShaFromAny(obj: any, variables: MapWithLength): string {
    if (!isObject(obj)) {
        return getShaFromString(JSON.stringify(obj))
    }

    if (Array.isArray(obj)) {
        return getShaFromString(JSON.stringify(obj.map(o => getShaFromAny(o, variables))))
    } else {
        const newObj = Object.fromEntries(Object.entries(obj).map(([k,v]) => [k, getShaFromAny(v, variables)]))
        const sha = getShaFromString(JSON.stringify(newObj))

        if (isNode(obj)) {
            (obj as any).sha = sha
            setVarname(obj as Node, sha, variables)
        }
        return sha
    }
}

function setVarname(node: Node, sha: string, variables: MapWithLength): void {
    variables.set(sha, [`$${variables.count++}`, node])
}

function getShaFromString(str: string): string {
    // Convert the string into a sha
    const hash = crypto.createHash('sha1')
    hash.update(str)
    return hash.digest('hex')
}