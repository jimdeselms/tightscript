export type ScalarType = string | number | boolean | null | undefined
export type SExpression = ScalarType | [string, ...SExpression[]]

export function isSExpression(value: Expr | SExpression): value is SExpression {
    return (
        typeof value === 'string' ||
        typeof value === 'number' ||
        typeof value === 'boolean' ||
        value === null ||
        Array.isArray(value) ||
        value === undefined
    )
}

export type Expr = {
    sExpression: SExpression
    isScalar: boolean
    sha: string
    [fields: string]: unknown
}

export function isExpr(value: unknown): value is Expr {
    return (
        value != null &&
        typeof value === 'object' &&
        'sExpression' in value &&
        'isScalar' in value &&
        'sha' in value
    )
}
