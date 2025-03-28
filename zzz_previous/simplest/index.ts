export type ScalarValue = string | number | boolean | null | undefined
export type SHA = string
export type SExpression = ScalarValue | [ string, ...SHA[] ]
export type DeepSExpression = ScalarValue | [ string, ...DeepSExpression[] ]

export type CompiledExpressionResolver<TInput, TOutput> = (input: TInput) => CompiledExpression<TInput, TOutput>

export type CompiledExpression<TInput, TOutput> = {
    sExpression: SExpression
    realWorldValue: TOutput | undefined

    compiledFn: (input: TInput) => CompiledExpressionResolver<TInput, TOutput>
}

export type Compiler<TInput, TOutput> = (expr: SExpression) => CompiledExpressionResolver<TInput, TOutput>



