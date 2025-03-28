/* eslint-disable @typescript-eslint/no-empty-object-type */
/* eslint-disable @typescript-eslint/no-unused-vars */
/**
 * I am building a compiler that works as a pipeline. It has an input stream and an output stream.
 * 
 * The goal here is not to flesh out any single aspect of the pipeline and build the other parts of the pipeline
 * around it.
 * 
 * This time, I want to build a full, working, end-to-end machine that does everything I want.
 * 
 * And what do I want? It is spelled out by each of the stages of the pipeline.
 * 
 * At each stage of the pipeline, we are building a machine that reads an input stream, updates state,
 * and writes output to an output function.
 * 
 * The initial state is optional, which means that if the pipeline requires state, its creation function must create a default state.
 * 
 * Also, the pipeline MUST make a COPY of the initial state so that it doesn't modify a thing that might be shared.
 * 
 * In this implementation, I want to say that the internal state is copied, so it is mutated internally, but should be invisible
 * to the scope that created the pipeline.
 */
export type Pipeline<TIn, TOut, TState> = (onOut: (out: TOut) => void, initialState?: TState) => {
    send(input: TIn): void
}

export function definePipeline<TIn, TOut, TState=unknown>(): Pipeline<TIn, TOut, TState> {
    return null as unknown as Pipeline<TIn, TOut, TState>
}

export type Token = string | number | boolean | null | undefined
export type AST = {};
export type SExpression = Token | SExpression[]

// Read in a stream of tokens and build a stream of ASTs
// Each AST should be a language statement to evaluate or expression to evalutate.
const LEXER_PIPELINE = definePipeline<Token, AST>()

// The AST gets transformed into a LISP-style S-Expression
const PARSER_PIPELINE = definePipeline<AST, SExpression>()

// This stage in the pipeline registers the S-expression so that we can share identical instances.
const REGISTER_PIPELINE = definePipeline<SExpression, SExpression, RegisterState>()
type RegisterState = {
    shas?: Map<string, SExpression>
    reverseLookup?: Map<SExpression, SExpression>
}

// The balancing pipeline -- I won't bother with it for now I think? -- but the balancing
// pipeline could be used to transform the S-expression so that its nodes are all approximately
// the same depth
const BALANCING_PIPELINE = definePipeline<SExpression, SExpression>()

// This pipeline examines the S-expression and determines its cost, then returns the SExpression with the attached
// cost metadata. If we've already calculated the cost, we should be able to reuse the result.
const COSTING_PIPELINE = definePipeline<SExpression, SExpression>()

// This pipeline looks at all the binary expressions and ensures that they are ordered according to their
// cost. That is, if I have "x || y" -- or any other function that can short circuit -- then I want to reorder
// the expression so that the less-expensive side is evaluated first.
//
// For functions like "add" or "mul", that's simple, since the arguments can be swapped. For other functions
// like "div" or "sub", there will be a reversed version of the function so that (div a b) === (div_rev b a)
const REORDERING_PIPELINE = definePipeline<SExpression, SExpression>()


// The branching pipeline reads in a stream of s-expressions, and converts them into a stream
// of segments, where a segment is either a collection of tokens or a conditional branch
// which -- when evaluated -- causes a branch to the ifTrue or ifFalse expressions
const BRANCHING_PIPELINE = definePipeline<SExpression, ConditionalStreamSegment>()
type ConditionalStreamSegment = Token[] 
    | { 
        condition: ConditionalStreamSegment, 
        ifTrue: ConditionalStreamSegment,
        ifFalse: ConditionalStreamSegment,
    }

// The evaluation pipeline takes a conditional stream segment and runs it, returning a function
// that can be run against a state to make some change to it.
const EVALUATION_PIPELINE = definePipeline<ConditionalStreamSegment, StateFn>()
type StateFn<TState=unknown> = (state: TState) => void

// State functions will put things into an "output" state, which this pipeline
// will pick up, and then it will emit the "output" objects to the pipeline's output stream.
// The output stream will return an "unresolved output", which means that it won't be fully resolved, meaning
// that it might have some "lazy" properties that won't be evaluated until they're explicitly referenced.
const STATE_TO_OBJECT_PIPELINE = definePipeline<StateFn, UnresolvedOutput>()
type UnresolvedOutput = ResolvedOutput
| { [key: string]: UnresolvedOutput } | UnresolvedOutput[] 
| ((...args: UnresolvedOutput[]) => UnresolvedOutput)
| (() => UnresolvedOutput)

// This should be the final phase; it takes unresolved input and fully resolves it and returns it.
const RESOLUTION_PIPELINE = definePipeline<unknown, ResolvedOutput>()
type ResolvedOutput = string | number | boolean | null | undefined 
| { [key: string]: ResolvedOutput } | ResolvedOutput[] 
| ((...args: ResolvedOutput[]) => ResolvedOutput)

