export const enum VMOpcode {
    // Control Flow
    jmp = 'jmp',
    jt = 'jt',
    jf = 'jf',

    // Calls
    call = 'call',
    ret = 'ret',

    // Stop processing further
    halt = 'halt',

    // Since instructions are strings, we can do this to explicitly add a string.
    string = 'string',
}

export type VMApi<TExpr, TState> = {
    push(expr: TExpr): void
    pop(): TExpr
    drop(): void
    dup(): void
    swap(): void
    halt(): void

    state: TState
}

export type VMInstruction = string | number | boolean | null | undefined

export type VMHandler<TExpr, TState> = (vm: VMApi<TExpr, TState>) => void

export class VM<TExpr extends VMInstruction, TState> {
    private readonly instructions: VMInstruction[]
    private readonly stack: TExpr[]
    private readonly callStack: number[]
    private readonly state: TState
    private readonly handlers: Record<string, VMHandler<TExpr, TState>>

    private IP = 0
    private halted: boolean = false

    constructor(instructions: VMInstruction[], handlers: Record<string, VMHandler<TExpr, TState>>, initialState: TState) {
        this.instructions = instructions
        this.handlers = handlers
        this.IP = 0
        this.stack = []
        this.callStack = []
        this.state = initialState
    }

    run() {
        while (!this.halted) {
            this.step()
        }

        return this.stack[this.stack.length-1]
    }

    step() {
        if (this.halted) {
            return
        }

        const instruction = this.instructions[this.IP]
        if (typeof instruction !== 'string') {
            this.stack.push(instruction as TExpr)
            this.IP++
            return
        }

        switch (instruction) {
            case VMOpcode.jmp: {
                this.IP = this.instructions[this.IP + 1] as number
                return
            }

            case VMOpcode.jt: {
                const val = this.stack.pop()
                this.IP = !!val
                    ? this.instructions[this.IP + 1] as number
                    : this.IP + 2
                    
                return
            }

            case VMOpcode.jf: {
                const val = this.stack.pop()
                this.IP = !val
                    ? this.instructions[this.IP + 1] as number
                    : this.IP + 2
                    
                return
            }

            case VMOpcode.call: {
                const next = this.IP + 2
                this.callStack.push(next)
                this.IP = this.instructions[this.IP + 1] as number
                return
            }

            case VMOpcode.ret: {
                this.IP = this.callStack.pop()!
                return
            }

            case VMOpcode.string: {
                this.stack.push(this.instructions[this.IP + 1] as TExpr)
                this.IP += 2
                return
            }

            case VMOpcode.halt: {
                this.halted = true
                this.IP++
                return
            }
        }

        // If we've gotten here, then we're invoking one of the other instructions.
        const handler = this.handlers[instruction]
        if (!handler) {
            throw new Error(`No handler for instruction ${instruction}`)
        }

        const api: VMApi<TExpr, TState> = {
            push: (expr: TExpr) => {
                this.stack.push(expr)
            },
            pop: () => {
                return this.stack.pop()!
            },
            drop: () => {
                this.stack.pop()
            },
            dup: () => {
                this.stack.push(this.stack[this.stack.length - 1])
            },
            swap: () => {
                const copy = this.stack[this.stack.length - 1]
                this.stack[this.stack.length - 1] = this.stack[this.stack.length - 2]
                this.stack[this.stack.length - 2] = copy
            },
            halt: () => {
                this.halted = true
            },

            state: this.state
        }

        // Now the handler will just do what it's going to do
        handler(api)
        this.IP++
    }
}