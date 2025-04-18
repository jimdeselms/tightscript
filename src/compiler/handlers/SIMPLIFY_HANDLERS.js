
/**
 * @reutrns Record<string, (arg: any | undefined) => SExpression
 */
export function SIMPLIFY_HANDLERS(state, simplify, compile) {
    return {
        negate: (value) => {
            if (value === undefined) { return undefined }
            const cValue = compile(value)()
            return cValue === undefined
                ? ['negate', value]
                : -cValue
        }
    }    
}
