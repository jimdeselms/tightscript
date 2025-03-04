// A function that modifies state and then returns the next function to call with the modified state, until there are no more changes to make.
export type ExprFn<TState> = (state: TState) => ExprFn<TState> | null

