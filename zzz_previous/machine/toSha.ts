import * as crypto from 'crypto'

export function getShaFromString(str: string): string {
    // Convert the string into a sha
    const hash = crypto.createHash('sha1')
    hash.update(str)
    return hash.digest('hex')
}
