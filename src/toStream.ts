// @ts-nocheck

export function* toStream(sExpression) {
    if (Array.isArray(sExpression)) {
        if (sExpression[0] === 'fn') {
            // If this is a fn, then the next thing is as is
            const fn = sExpression[1]

            // Wrap it if it's not an array
            if (Array.isArray) {
                yield Array.from(toStream(fn))
            } else {
                yield [fn]
            }
 //           yield Array.isArray(fn) ? toStream(fn) : [fn]
        } else {
            for (const item of sExpression.reverse()) {
                yield* toStream(item)
            }
        }
    } else {
        yield sExpression
    }
}
