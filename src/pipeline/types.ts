export type Pipeline<TIn, TOut> = (iter: AsyncIterable<TIn>) => AsyncIterable<TOut>

