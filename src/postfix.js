export function postfix(sExpression) {
    if (!Array.isArray(sExpression)) {
        return [sExpression]
    }

    const result = []
    const [first, ...rest] = sExpression

    result.push(first)
    for (const e of rest) {
        if (typeof e === 'string') {
            // We differentiate between primitive names and string literals which are just placed on the stack.
            result.push(`"${e}"`)
        } else {
            result.push(...postfix(e))
        }
    }

    return result
}