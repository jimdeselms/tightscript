// @ts-nocheck
import { parse } from 'path'
import { EXPRESSION_PRIMITIVES } from './EXPRESSION_PRIMITIVES'

// This function takes an S-expression and returns a function that takes a sequence of tokens that will be passed to the compiler.
// The machine doesn't know what it's going to do with the output tokens; it's up to the compiler to interpret them.
export function machine(sExpression) {
    // At this point, it's all just about returning a stream of low-level instructions
    if (Array.isArray(sExpression)) {
        const [ fn, ...args ] = sExpression
        const handler = EXPRESSION_PRIMITIVES[fn]
        if (!handler) {
            return Array.from(postfix(sExpression))
        }
        return handler(...args)
    } else {
        return [ sExpression ]
    }
}

function asArg(value) {
    if (value in CONSTANTS) {
        return CONSTANTS[value]
    } else {
        const asNum = parseFloat(value)
        return isNaN(asNum) ? value : asNum
    }
}

const CONSTANTS = {
    true: true,
    false: false,
    null: null,
    undefined: undefined
}

function* postfix(sExpression) {

    if (Array.isArray(sExpression)) {
        for (const item of sExpression.reverse()) {
            yield* postfix(item)
        }
    } else {
        yield sExpression
    }
}
