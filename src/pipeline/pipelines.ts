/* eslint-disable @typescript-eslint/no-explicit-any */
import { Pipeline } from "."

export function linkPipelines<TIn, TOut, TSharedState, TMid>(
    inPipeline: Pipeline<TIn, TMid, TSharedState>, 
    outPipeline: Pipeline<TMid, TOut, TSharedState>
): Pipeline<TIn, TOut, TSharedState> {
    return (onOut: (out: TOut) => void, initialState: TSharedState) => {

        const outInstance = outPipeline(onOut, initialState)

        const inInstance = inPipeline((mid: TMid) => {
            outInstance.send(mid)
        }, initialState)

        return inInstance
    }
}

export function chainPipelines<TIn, TOut, TState=unknown>(
    ...pipelines: Pipeline<unknown, unknown, TState>[]
): Pipeline<TIn, TOut, TState> {
    return (onOut: (out: TOut) => void, initialState: TState) => {
        if (pipelines.length === 0) {
            // If there are no input pipelines, that's the same as the identity function
            return { send: (input: TIn) => onOut(input as unknown as TOut) }
        }
        
        let currentPipeline: any = pipelines[0](onOut as any, initialState)

        for (let i = 1; i < pipelines.length; i++) {
            const nextPipeline = pipelines[i]
            currentPipeline = linkPipelines(currentPipeline, nextPipeline)(onOut as any, initialState)
        }

        return currentPipeline
    }
}
