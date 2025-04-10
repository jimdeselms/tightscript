export * from './machine'

export type MachineState = {
    input: any[]
    output: any[]
    stack: any[]
}

export type Handler = (state: MachineState, value: any) => void
