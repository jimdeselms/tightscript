import * as crypto from 'crypto'
import { Node } from 'acorn'

import { isNode, isObject } from './isNode'

export function addSha(node: Node): void {
    if (!isObject(node)) {
        return node        
    }

    if (isNode(node)) {
        (node as any).sha = getSha(node)
    }
}

function getSha(node: Node): string {
    if (isNode(node) && 'sha' in node) {
        return node.sha as string
    }

    if (!isObject(node)) {
        return getShaFromString(JSON.stringify(node))
    }

    const sha = getShaFromAny(node);
    (node as any).sha = sha

    return sha
}

function getShaFromAny(obj: any): string {
    if (!isObject(obj)) {
        return getShaFromString(JSON.stringify(obj))
    }

    if (Array.isArray(obj)) {
        return getShaFromString(JSON.stringify(obj.map(getShaFromAny)))
    } else {
        const newObj = Object.fromEntries(Object.entries(obj).map(([k,v]) => [k, getShaFromAny(v)]))
        const sha = getShaFromString(JSON.stringify(newObj))

        if (isNode(obj)) {
            (obj as any).sha = sha
        }
        return sha
    }
}

function getShaFromString(str: string): string {
    // Convert the string into a sha
    const hash = crypto.createHash('sha1')
    hash.update(str)
    return hash.digest('hex')
}