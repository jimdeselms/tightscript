import crypto from 'crypto'

/**
 * The rules:
 * 1) Types are predicate functions. A thing is a T if its type predicate function says it is.
 *     * If they're named, they look just like Typescript types
 *     * type PositiveInteger = x => !isNaN(x) && x > 0
 * 2) Types (predicate functions) are assigned to the arguments of functions
 *     * Before calling the function, the compiler will ensure that the function's arguments all pass their required type predicates.
 *     * If any of the function's arguments don't pass their predicates, then the function throws an uncatchable error.
 * 3) Function returns can be assigned types. The compiler will ensure that the output of the function passes the predicate.
 * 4) Variables can be assigned types. This can usually be inferred to be equal to the initialization value, but if you want to ensure that the assignment
 *    to a variable is of a certain type, then you can specify the type.
 * 5) Since types are strictly enforced, if a function gives precise type predicates for each of the arguments, then the function itself will not need to do any 
 *    runtime-verification to make sure that the inputs are actually valid.
 * 
 * Internal consistency rules:
 * 
 * The magic of bifoql is the internal machine. It is a perfectly pure function that -- given the same inputs -- will give the same output.
 * 
 * A function MUST:
 * * Assume that the arguments into the function are valid; there should be no type checking inside the function.
 * * Guarantee that the output of the function matches the output type.
 * 
 */
// A symbolic expression is a Lisp-style S-expression which is either a scalar value or a
// list, which can nest. A symbolic expression type may also include an arbitrary type T.
// For example, you could have a symbolic expression class where you might store Javascript functions
// rather than (fn '(+ $ 2))`.
export type SymbolicExpression = ScalarValue | NonScalarValue
export type NonScalarValue = SymbolicExpression[]

export function isNonScalarValue(x: any): x is NonScalarValue {
    return Array.isArray(x)
}

export function isScalarValue(x: any): x is ScalarValue {
    return !Array.isArray(x)
}

// A symbolic expression is basically a lisp expression `(this (is a symbolic) expression)`; it's either a scalar value,
// or it's a nested list of symbolic expressions.
export type ScalarValue = string | number | boolean | null

// A mapper is a function that maps one symboilc expression into another
// A mapper may be given additional context.
export type Mapper = (expr: SymbolicExpression) => SymbolicExpression

export type FunctionMapper = (...args: any[]) => SymbolicExpression

// A mapping scheme is a set of named mappers which works as a mapping function.
export type MappingScheme = Record<string, FunctionMapper>

export type ExpressionHub = {
    symbolic: SymbolicExpression

    // The symbolic expression must be strictly typed, but we can also have a bag of other values.
    [key: string]: any
}