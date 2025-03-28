import { Registry } from './registry'
import { getSymbolMachineHandler } from './getSymbolMachineHandler'

// Creates a machine that takes a sequence of tokens to evaluate.
// This machine does not understand conditionals; rather, it's the responsibility of the outer 
// machine to look at the conditionals on the top of the stack and figure out how to handle it.
//
// 
export function createSymbolMachine(onOutputSymbol) {
    const registry = new Registry()
    const publicState = {
        halt: false,
        topOfStack: () => state.stack[state.stack.length - 1],
    }

    const state = {
        onOutputSymbol,
        registry,

        stack: [],
        publicState,
    }

    const send = (...symbols) => {
        // I'm sure this can be optimized later to compile it into a function.
        for (const symbol of symbols) {
            if (state.publicState.halt) {
                // If we're halted, then there's nothing to do.
                // We could consider throwing an error.
                return
            }
    
            const handler = getSymbolMachineHandler(symbol)
    
            if (handler) {
                handler(state)
            } else {
                throw "Unknown symbol " + symbol
            }
        }
    }

    return [send, state]
}