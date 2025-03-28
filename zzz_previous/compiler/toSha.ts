import * as crypto from 'crypto'
import { isNode } from './isNode'

// This can be optimized further by creating a map of a number of known constants
// like true, false, null, 0, 1, "", etc. All of the known key types of a Node as well
const UNDEFINED = getShaFromString(" undefined ")

export function toSha(obj: any): string {
    if (obj === undefined) {
        return UNDEFINED
    }

    if (obj == null || typeof obj !== 'object') {
        return getShaFromString(JSON.stringify(obj))
    }

    if (isNode(obj)) {
        // We don't care about 
        const { start, end, ...rest } = obj
        return nonNodeToSha(rest)
    } else {
        return nonNodeToSha(obj)
    }
}

function nonNodeToSha(obj: any): string {
    if (Array.isArray(obj)) {
        return getShaFromString(obj.map(toSha).join(''))
    } else {
        const keys = Object.keys(obj).sort()
        const keyValueShas = keys.map(key => getShaFromString(key + ':' + toSha(obj[key])))
        return keyValueShas.join('')
    }
}

function getShaFromString(str: string): string {
    // Convert the string into a sha
    const hash = crypto.createHash('sha1')
    hash.update(str)
    return hash.digest('hex')
}