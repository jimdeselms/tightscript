// I think if I formulate this as this very simple VM, then that might make this easier to reason about.


class Vm {
    public readonly inputQueue: number[]
    public readonly outputQueue: number[]
    public readonly memory: Uint32Array
    public readonly stack: number[]
    
    private readonly code: Uint32Array
    private ip: number
    private state: VmState

    constructor() {
        this.code = new Uint32Array(1000)
        this.memory = new Uint32Array(1000)
        this.inputQueue = []
        this.outputQueue = []
        this.stack = []
        this.state = 'running'
        this.ip = 0
    }

    step() {
        if (this.ip > this.code.length) {
            this.state = 'faulted'
            return this.state
        }

        const currCode = this.code[this.ip]
        if (currCode < OPCODE_COUNT) {
            this.state = 'faulted'
            return this.state
        }

        const handler = OPCODES[currCode]
    
        return handler(this)
    }
}

export type Opcode = "read" | "write" | "jump" | "cond" | "push"

const OPCODE_TO_IDX: Record<Opcode, number> = {
    'read': 0,
    'write': 1,
    'jump': 2,
    'cond': 3,
    'push': 4
}
const OPCODE_COUNT = Object.keys(OPCODE_TO_IDX).length

type Handler = (vm: Vm) => VmState

const OPCODES: Handler[] = [
    READ_OP,
    WRITE_OP,
    JUMP_OP,
    COND_OP,
    PUSH_OP    
]

export function createVm(code: (string | number)[], memSize: number=0): Vm {
    const codeMem = new Uint32Array(code.length)
    
    for (let i = 0; i < code.length; i++) {
        if (typeof code[i] === 'string') {
            codeMem[i] = OPCODE_TO_IDX[code[i] as Opcode]
        } else {
            codeMem[i] = code[i] as number
        }
    }

    const memory = new Uint32Array(memSize)

    return {
        code: codeMem,
        inputQueue: [],
        outputQueue: [],
        memory,
        stack: [],
        ip: 0
    }
}

export type VmState = 'running' | 'waiting' | 'halted' | 'faulted'

export function advanceVm(vm: Vm) {
    const currCode = vm.code[vm.ip]
    const handler = OPCODES[currCode]

    if (!handler) {
        throw new Error(`Invalid opcode: ${currCode}`)
    }

    handler(vm)
}

function READ_OP(vm: Vm): VmState {
    if (vm.inputQueue.length === 0) {
        // Nothing to do
        return 'waiting'
    }

    const value = vm.inputQueue.shift() as number
    vm.stack.push(value)
    vm.ip++
    return 'running'
}

function WRITE_OP(vm: Vm): VmState {
    const value = vm.stack.pop() as number
    vm.outputQueue.push(value)
    vm.ip++
    return 'running'
}

function JUMP_OP(vm: Vm): VmState {
    const address = vm.stack.pop() as number
    vm.ip = address
    return 'running'
}

function COND_OP(vm: Vm): VmState {
    const ifFalse = vm.stack.pop() as number
    const ifTrue = vm.stack.pop() as number
    if (vm.stack.pop()) {
        vm.ip = ifTrue
    } else {
        vm.ip = ifFalse
    }
    return 'running'
}

function PUSH_OP(vm: Vm): VmState {
    const value = vm.code[vm.ip + 1]
    vm.stack.push(value)
    vm.ip += 2
    return 'running'
}