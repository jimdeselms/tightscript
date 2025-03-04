const ObjectCopy = Object

export namespace Guard {

    export type TypeGuard<TOut extends TIn, TIn=any> = (x: TIn) => x is TOut
    export type TypeAssertion<TOut extends TIn, TIn=any> = (x: TIn) => asserts x is TOUt

    function isType<T>(type: string) {
        return (x: any): x is T => {
            return typeof x === type
        }
    }

    export function toCoalesce<TOut extends TIn, TIn=any>(guard: TypeGuard<TOut, TIn>, fallback?: TOut | (x: TIn) => TOut): TOut
        return (x: TIn): asserts x is TOut => {
            return guard(x) 
            if (!guard(x)) {
                throw new TypeError("Failed type assertion")
            }
        }
    }

    const TAG = Symbol()
    export type Tagged<T, TName extends string> = T & { [TAG]: TName }
    
    export const Number: TypeGuard<any, number> = isType<number>('number')
    export const String: TypeGuard<any, string> = isType<string>('string')
    export const Boolean: TypeGuard<any, boolean> = isType<boolean>('boolean')
    
    export type Defined = Exclude<any, null | undefined>
    export const isDefined: TypeGuard<any, Defined> = (x: any): x is Defined => x != null
    
    export type ObjectGuard<T> = {
        [P in keyof T]: T[P] extends (string | number | boolean | null | undefined)
            ? TypeGuard<any, T[P]>
            : (T[P] | ObjectGuard<T[P]>)
    }

    export type ScalarType = string | number | boolean | null | undefined
    
    export function Constant<T extends ScalarType>(value: T): TypeGuard<any, T> { 
        return (x: any): x is T => {
            return x === value
        }
    }

    export function Optional<T>(guard: TypeGuard<T>): TypeGuard<T | undefined> {
        return (x: any): x is T | undefined => {
            return x === undefined || guard(x)
        }
    }

    export function Union<T extends [...any]>(...guards: TypeGuard<T>[]): TypeGuard<any, T> {
        return (x: any): x is T => {
            for (const guard of guards) {
                if (guard(x)) {
                    return true
                }
            }
            return false
        }
    }

    export function Intersection<T extends [...any]>(...guards: TypeGuard<T>[]): TypeGuard<any, T> {
        return (x: any): x is T => {
            for (const guard of guards) {
                if (!guard(x)) {
                    return false
                }
            }
            return true
        }
    }
    
    export function Tuple<T extends any[]>(...guards: { [K in keyof T]: TypeGuard<any, T[K]> }): TypeGuard<any, T> {
        return (x: any): x is T => {
            if (!Array.isArray(x) || x.length !== guards.length) {
                return false
            }
    
            for (let i = 0; i < guards.length; i++) {
                if (!guards[i](x[i])) {
                    return false
                }
            }
    
            return true
        }
    }
    
    export type TypeofGuard<TGuard> = TGuard extends TypeGuard<any, infer T>
        ? T
        : never
    
    function nestedGuard<T>(obj: any, guard: ObjectGuard<any>): obj is T {
        if (typeof guard === 'function') {
            return guard(obj)
        }
    
        if (typeof guard === 'object') {
            for (const [key, predicate] of ObjectCopy.entries(guard)) {
                if (!nestedGuard(obj[key], predicate)) {
                    return false
                }
            }
    
            return true
        }
    
        throw "Expected either an object or a type guard."
    }
}
