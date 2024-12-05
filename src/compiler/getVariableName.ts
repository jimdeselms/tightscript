export function getVariableName(index: number): string {
    return compactId(index)
}


// These are the valid first letters for a variable name.
// No numbers, and '$' is reserved as a first character.
// We could expand these to include a whole bunch of other characters, but they probably
// won't actually save space since they won't be encoded in utf-8.
const FIRST_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz_'
const FIRST_CHARS_LEN = FIRST_CHARS.length

// For the second character, we can use any of these characters
const SECOND_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz_$0123456789'
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