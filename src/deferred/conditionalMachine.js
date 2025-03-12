import { Registry } from './registry'
import { createSymbolMachine } from './symbolMachine'

// Creates a machine that takes a sequence of tokens to evaluate.
// This machine does not understand conditionals; rather, it's the responsibility of the outer 
// machine to look at the conditionals on the top of the stack and figure out how to handle it.
//
// 
export function symbolicExpander(onOutputSymbol) {

    function enqueue(sym) {
        if (Array.isArray(sym)) {
            for (const s of sym) {
                enqueue(s)
            }
        } else {
            onOutputSymbol(sym)
        }
    }

    return (...symbols) => {
        for (const sym of symbols) {
            enqueue(sym)
        }
    }
}