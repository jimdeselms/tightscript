type Stream<T> = AsyncIterable<T>

// If the machine doesn't know about IO, then we can define a machine like this.
// Basically, the IP starts at 0, and we look at the instruction at that location.

export type Machine = {
    stack: number[]
    instructions: number[]
    ip: number
}

// It's all about this step function. Every kind of machine can be boiled down to this.
// Returns null if the machine will not do any more processing.
export type Step<TIn, TState, TOut> = (state: TState, input: TIn) => TOut[]

// Creates a machine that takes an input stream and state and yields an output stream.
function machine<TIn, TOut, TState>(stepFn: Step<TIn, TState, TOut>) {
    return async function* (input: Stream<TIn>, state: TState): Stream<TOut> {

        for await (const value of input) {
            const outputs = stepFn(state, value)
            yield* outputs
        }
    }
}

// A listener that listens for values
type ListenFn<T> = (value: T) => void
type Unsub = () => void

// A class that creates a machine where you can write items to the input stream and listen on the output stream.
class IOMachine<TIn, TOut, TState> {
    private readonly stepFn: Step<TIn, TState, TOut>
    private readonly state: TState
    private subscribers: Map<Unsub, ListenFn<TOut>>

    constructor(stepFn: Step<TIn, TState, TOut>, initialState: TState) {
        this.state = initialState
        this.stepFn = stepFn
        this.subscribers = new Map<Unsub, ListenFn<TOut>>()
    }

    write(input: TIn) {
        const result = this.stepFn(this.state, input)
        const subscribers = Array.from(this.subscribers.values())

        for (const output of result) {
            subscribers.forEach(s => s(output))
        }
    }

    subscribe(listener: ListenFn<TOut>): Unsub {
        const unsub = () => {
            this.subscribers.delete(unsub)
        }

        this.subscribers.set(unsub, listener)

        return unsub
    }
}

// NOW - if we think in terms of these functions stream/machine functions, I think that we can build our compiler.
