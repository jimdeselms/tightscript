import { expr } from '../../parse'
/**
 * @reutrns Record<string, (arg: any | undefined) => SExpression
 */
export function SIMPLIFY_HANDLERS(state, simplify, compileWithArgArray) {

    const compile = (val) => compileWithArgArray(val)([])
    
    return {
        negate: (value) => {
            const cValue = compile(value)
            return cValue === undefined
                ? expr`(if (isNumber ${value}) (negate_safe ${value}) null)`
                : -cValue
        },

        error: (value) => {
            const cValue = compile(value)

            return new Error(cValue)
        },

        isUndefined: (value) => {
            const cValue = compile(value)
            return cValue === undefined
        }
    }
}
