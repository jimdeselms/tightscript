import { expr } from '../../parse'
/**
 * @reutrns Record<string, (arg: any | undefined) => SExpression
 */
export function SIMPLIFY_HANDLERS(state, simplify, compileWithArgArray) {

    const compile = (val) => compileWithArgArray(val)([])

    const add = BINARY(compile, "add_safe", (lhs, rhs) => lhs + rhs)
    const negate = UNARY(compile, "negate_safe", (value) => -value)

    return {
        negate,

        add,

        error: (value) => {
            const cValue = compile(value)

            return new Error(cValue)
        },

        isError: (value) => {
            const cValue = compile(value)
            if (cValue === undefined) {
                return undefined
            }

            return cValue instanceof Error
        },

        isUndefined: (value) => {
            const cValue = compile(value)
            return cValue === undefined
        }
    }
}

function BINARY(compile, safeFun, ifValid) {
    return (lhs, rhs) => {
        const clhs = compile(lhs)
        const crhs = compile(rhs)

        if (clhs === undefined || crhs === undefined) {
            expr`
            (if (isNumber ${lhs})
                (if (isNumber ${rhs})
                    (${safeFun} ${lhs} ${rhs})
                    (error "add rhs must be a number")
                )
                (error "add lhs must be a number")
            )`
        }


        if (isError(clhs)) {
            return lhs
        }

        if (isError(crhs)) {
            return rhs
        }

        if (typeof clhs !== 'number') {
            return ['error', 'add lhs must be a number']
        }

        if (typeof crhs !== 'number') {
            return ['error', 'add rhs must be a number']
        }

        return ifValid(clhs, crhs)
    }
}

function UNARY(compile, safeFun, ifValid) {
    return (value) => {
        const cValue = compile(value)
        if (cValue === undefined) {
            return expr`(if (isNumber ${value}) (${safeFun} ${value}) (error "negate value must be a number"))`
        }

        if (isError(cValue)) {
            return(cValue)
        }

        if (typeof cValue !== 'number') {
            return ['error', 'negate value must be a number']
        }

        return ifValid(cValue)
    }
}

function isError(value) {
    return value instanceof Error
}
