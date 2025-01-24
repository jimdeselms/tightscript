export type MachineState = {
    stack: number[]
    ip: number
    more: boolean
}

export type Stack = number[]

export type Instruction = number

const INITIAL_STATE: MachineState = { stack: [], ip: 0, more: true }

export const I = {
    int: 0,
    jmp: 1,
    if: 2,
    halt: 3,
    add: 4,
}

export class Machine {
    private readonly instructions: Int32Array
    private state: MachineState

    constructor(instructions: Instruction[]) {
        this.instructions = new Int32Array(instructions)
        this.state = { ...INITIAL_STATE }
    }

    // Reset the machine to its initial state.
    reset() {
        this.state = { ...INITIAL_STATE }
    }

    // Get the value at the top of the stack.
    // You can only get the value if the machine is done processing.
    top(): number | undefined {
        if (this.state.more) {
            return undefined
        } else {
            return this.state.stack[this.state.stack.length - 1]
        }
    }

    run() {
        while (this.step()) {}
        return this.top()
    }

    step(): boolean {
        // TODO - It should be possible to build an optional safety net to detect infinite loops.
        // If we get a SHA for the combination of the instructions and the current state of the system,
        // and if we've seen that SHA before, then we know that we're re-evaluating state that we've already seen.
        // If we're done, we will not try to do any more.
        if (!this.state.more) {
            return false
        }

        const instruction = this.instructions[this.state.ip]

        // If the instruction is a number, we just add it to the stack.
        if (instruction === I.int) {
            // The value after the current IP is a number to push onto the stack.
            // Then advance to the address after that.
            this.state.stack.push(this.instructions[this.state.ip + 1])
            this.state.ip += 2
            return true
        } else if (instruction === I.jmp) {
            // jmp sets the IP to the address after the current IP
            this.state.ip = this.instructions[this.state.ip + 1]
            return true
        } else if (instruction === I.if) {
            // if looks at the condition on the stack, and jumps to the address directly after the IP if true, or two after the IP if false.
            const condition = this.state.stack.pop()
            if (condition !== 0) {
                this.state.ip = this.instructions[this.state.ip + 1]
            } else {
                this.state.ip = this.instructions[this.state.ip + 2]
            }
            return true
        } else if (instruction === I.halt) {
            // Done tells the outside world that the machine doesn't have any more work to do.
            this.state.more = false
            return false
        } else {
            // Any other string is interpreted as a call to one of these handlers.
            const handler = HANDLERS[instruction]
            if (!handler) {
                throw "Invalid instruction " + instruction
            }

            // We call the handler, which updates the stack in some way
            handler(this.state.stack)
            this.state.ip++
            return true
        }
    }
}

const HANDLERS: Record<string, (s: Stack) => void> = {
    [I.add]: (stack: Stack) => { stack.push(stack.pop()! + stack.pop()!) }
}