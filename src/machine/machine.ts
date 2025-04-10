import { Handler, MachineState } from ".";
import { HANDLERS } from "./handlers";

export const a = 1

function INITIAL_STATE() { 
    return structuredClone({
        input: [],
        output: [],
        stack: [],
    })
}

export type Machine = (state: MachineState) => void

export function createMachine(onOut: (value: any) => void) {
    const state = INITIAL_STATE()

    const theMachine = machine(HANDLERS)

    return (...input: any[]) => {
        for(const i of input) {
            run(i, state, theMachine)
        }

        for (const out of state.output) {
            onOut(out)
        }
        state.output = []
    }
}

function run(input: any, state: MachineState, theMachine: Machine) {
    state.input.push(input)

    while (state.input.length > 0) {
        theMachine(state)
    }
}

export function machine(handlers: Record<string, Handler>): Machine {
    return (state: MachineState) => {
        if (state.input.length === 0) return

        const curr = state.input.shift()

        let handler: Handler | undefined

        switch (typeof curr) {
            case 'string':
                handler = handlers[curr]
                break
            case 'number':
            case 'boolean':
                handler = handlers[typeof curr]
                break
            case 'object':
                if (curr === null) {
                    return handlers.null
                } else {
                    return handlers.expr
                }
            default:
                throw new Error(`Unknown type: ${typeof curr}`)
        }

        handler(state, curr)
    }
}
