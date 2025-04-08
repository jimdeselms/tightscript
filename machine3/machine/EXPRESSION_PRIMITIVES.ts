// @ts-nocheck
import { expr } from "./parse"

// A primitive is a function that takes some number of args and returns an array of low-level instructions that will be "compiled" by the compiler.
export const EXPRESSION_PRIMITIVES = {
//    negate: (arg) => postfix(expr`(negate ${arg})`),
}

function* postfix(sExpression) {
    const result = []

    if (Array.isArray(sExpression)) {
        for (const item of sExpression.reverse()) {
            result.push(...postfix(item))
        }
    }

    return result
}
