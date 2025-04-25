import { parse as PARSE } from '../../parse.js'
import { PRIMITIVES } from './primitives.js'

export const literal = (x) => (args) => x
export const TRUE = literal(true)
export const FALSE = literal(false)
export const NULL = literal(null)
export const UNDEFINED = () => { throw "UNDEFINED" }

export const parse = (expr) => {
    const parsed = PARSE(expr)
    if (Array.isArray(parsed)) {
        const [prim, ...agrs] = parsed
        const parsedArgs = agrs.map(parse)
        const fn = PRIMITIVES[prim]
        return fn(...parsedArgs)
    } else {
        if (typeof parsed === 'string') {
            if (parsed === 'true') {
                return TRUE
            } else if (parsed === 'false') {
                return FALSE
            } else if (parsed === 'null') {
                return NULL
            }
        } else if (parsed === undefined) {
            return UNDEFINED
        }

        return literal(parsed)
    }
}

export function add(lhs, rhs) {
    return (args) => lhs(args) + rhs(args)
}
