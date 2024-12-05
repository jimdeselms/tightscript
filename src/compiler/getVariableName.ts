export function getVariableName(index: number): string {
    return compactId(index)
}


const FIRST_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz_'
const FIRST_CHARS_LEN = FIRST_CHARS.length
const SECOND_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz_0123456789'
const SECOND_CHARS_LEN = SECOND_CHARS.length

function compactId(num: number): string {

    if (num === 0) {
        return 'A'
    }

    let result = FIRST_CHARS[num % FIRST_CHARS_LEN];
    num = Math.floor(num / FIRST_CHARS_LEN)

    while (num > 0) {
        result += SECOND_CHARS[num % SECOND_CHARS_LEN]
        num = Math.floor(num / SECOND_CHARS_LEN)
    }

    return result
}