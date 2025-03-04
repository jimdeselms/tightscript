export type TypeGuard<T> = (x: T) => x is T

export type TypeGuardType<T> = T extends TypeGuard<infer U> ? U : never

export type TypeGuardOptions<T> = {
    /** A default value in case the value is null or undefined */
    default?: T

    /** 
     * If it has a value, but it doesn't match the type guard, this gives a chance to modify the value. 
     * 
     * Return undefined if the adjustment cannot be made
     */
    adjust?: (x: any) => T | undefined

    /**
     * Use this to override the behavior when there's a mismatch.
     * 
     * For example, if you'd like to log the mismatch rather than throw, which is the default.
     * 
     * The "wasAdjusted" parameter indicates whether the value was successfully adjusted or not (filling in missing values, or replacing mismatches.)
     */
    onMismatch?: (x: any, wasAdjusted: boolean) => void
}

export type ExtendedTypeGuard<T> = TypeGuard<T> & TypeGuardOptions<T>

export const Number: TypeGuard<number> = (x: any) => typeof x === 'number'
export const String: TypeGuard<string> = (x: any) => typeof x === 'string'

export type ObjectTypeGuard<T> = {
    [Prop in keyof T]: TypeGuard<T[Prop]> | ObjectTypeGuard<T>
}

export function ObjectGuard<T>(obj: ObjectTypeGuard<T>): TypeGuard<T> {
    // We want to convert this into an object where every value is a predicate.
    // If it's already a predicate, great. If it's not, the predicate is a rollup of the
    // child predicates
    const result: Record<string, TypeGuard<any>> = {}

    for (const key in obj) {
        if (typeof obj[key] === 'function') {
            result[key] = obj[key]
        } else {
            result[key] = ObjectGuard(obj[key] as ObjectTypeGuard<any>)
        }
    }

    // Now return a type guard that validates all the properties
    return (value: any): value is T => {
        for (const key in result) {
            const guard = result[key]
            if (guard(value[key])) {
                continue
            } else {
                return false
            }
        }
        return true
    }
}

export function toAssertion<T>(guard: TypeGuard<T>): (x: any) => asserts x is T {
    return (x: any): asserts x is T => {
        if (!guard(x)) {
            throw new TypeError(`Failed type assertion`)
        }
    }
}

export function validate<T>(x: any, guard: ExtendedTypeGuard<T>): T {
    if (guard(x)) {
        return x
    } else if (x == null && guard.default != null) {
        guard.onMismatch?.(x, true)
        return guard.default
    } else if (guard.adjust) {
        const adjusted = guard.adjust(x)
        if (adjusted) {
            guard.onMismatch?.(x, true)
            return adjusted
        }
    }

    if (guard.default) {
        return guard.default
    }

    if (guard.onMismatch) {
        guard.onMismatch(x, false)
    } else {
        throw new Error(`Type guard failed`)
    }

    // This is wrong, but if we get here, then we're falling back to unchecked Typescript.
    return x
}

export function extend<T>(guard: TypeGuard<T>, opts: TypeGuardOptions<T>): ExtendedTypeGuard<T> {
    // Make a copy of the function and attach the options to it.
    // Javascript allows functions to have other junk attached to them like an object.
    const extended = guard.bind({})
    Object.assign(extended, opts)
    return extended
}