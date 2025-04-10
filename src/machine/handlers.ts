import { Handler, MachineState } from '.'

export const HANDLERS: Record<string, Handler> = {
    'string': PUSH,
    'number': PUSH,
    'boolean': PUSH,
    'null': PUSH,

    'out': (state: MachineState) => state.output.push(state.stack.pop())
}

function PUSH(state: MachineState, value: any) {
    state.stack.push(value)
}