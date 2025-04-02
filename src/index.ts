export type ScalarInputSymbol = string | number | boolean | null | undefined | symbol | bigint | StringLiteral
export type InputSymbol = ScalarInputSymbol | Branch
export type Branch = [ InputSymbol[], InputSymbol[] ]
export type OutputSymbol = InputSymbol
export type StringLiteral = `"${string}"`
export type OutputCallback = (x: OutputSymbol) => void

// A primitive function takes an input.
// It might update state, and it might emit tokens to output, and it might return a set of tokens to be applied to the stack.
export type PrimitiveFn = (state: any, output: OutputCallback) => void
