import { expr } from '../parse'

export function UNARY(typeCheck, errorMsg, ifValidFn) {
    return (value) => {
        return expr`
            (if (isUndefined ${value})
                undefined
                (if (isError ${value})
                    ${value}
                    (if (${typeCheck} ${value})
                        ${ifValidFn(value)}
                        (error ${errorMsg})
                    )
                )
            )
        `
    }
}

export function BINARY(typeCheck, lhsErrorMsg, rhsErrorMsg, ifValidFn) {
    return (lhs, rhs) => {
        return expr`
            (if (isUndefined ${lhs})
                undefined
                (if (isUndefined ${rhs})
                    undefined
                    (if (isError ${lhs})
                        ${lhs}
                        (if (isError ${rhs})
                            ${rhs}
                            (if (${typeCheck} ${lhs})
                                (if (${typeCheck} ${rhs})
                                    ${ifValidFn(lhs, rhs)}
                                    (error ${rhsErrorMsg})
                                )
                                (error ${lhsErrorMsg})
                            )
                        )
                    )
                )
            )
        `
    }
}

// Here is the behavior with short-circuiting operators:
// Let's say we have multiplcation, where anything * 0 is 0.
// Generally speaking, undefined takes precedence over an error. So, if we have "error * undefined", the result is undefined.
// And then, if the right hand side resolves to "0", then that 0 will also take precedence over the error.
//
// So... in short circuiting operators, if one of the values is the short circuit value, then THAT takes precedence over everything else.
export function BINARY_WITH_SHORT_CIRCUIT(typeCheck, lhsErrorMsg, rhsErrorMsg, ifValidFn, shortCircuitFn) {
    return (lhs, rhs) => {
        return expr`
            (if ${shortCircuitFn(lhs)}
                ${lhs}
                (if ${shortCircuitFn(rhs)}
                    ${rhs}
                    (if (isUndefined ${lhs})
                        undefined
                        (if (isUndefined ${rhs})
                            undefined
                            (if (isError ${lhs})
                                ${lhs}
                                (if (isError ${rhs})
                                    ${rhs}
                                    (if (${typeCheck} ${lhs})
                                        (if (${typeCheck} ${rhs})
                                            ${ifValidFn(lhs, rhs)}
                                            (error ${rhsErrorMsg})
                                        )
                                        (error ${lhsErrorMsg})
                                    )
                                )
                            )
                        )
                    )
                )
            )
        `
    }
}
