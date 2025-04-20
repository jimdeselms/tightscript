import { expr } from '../parse'

export function negate(value) {
    return expr`
        (if (isUndefined ${value})
            undefined
            (if (isError ${value})
                ${value}
                (if (isNumber ${value})
                    (negate ${value})
                    (error "negate value must be a number")
                )
            )
        )
    `
}

export function add(lhs, rhs) {
    return expr`
        (if (isUndefined ${lhs})
            undefined
            (if (isUndefined ${rhs})
                undefined
                (if (isError ${lhs})
                    ${lhs}
                    (if (isError ${rhs})
                        ${rhs}
                        (if (isNumber ${lhs})
                            (if (isNumber ${rhs})
                                (add ${lhs} ${rhs})
                                (error "add rhs must be a number")
                            )
                            (error "add lhs must be a number")
                        )
                    )
                )
            )
        )
    `
}