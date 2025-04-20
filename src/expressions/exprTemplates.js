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
