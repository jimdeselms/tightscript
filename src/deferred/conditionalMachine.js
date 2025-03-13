import { Registry } from './registry'
import { createSymbolMachine } from './symbolMachine'

// Creates a machine that takes a sequence of tokens to evaluate.
// This machine does not understand conditionals; rather, it's the responsibility of the outer 
// machine to look at the conditionals on the top of the stack and figure out how to handle it.
//
// 
export function conditionalMachine(outputHandler) {

    const [send, state] = createSymbolMachine(outputHandler)

    let skipNext = false

    function enqueue(sym) {
        if (skipNext) {
            skipNext = false
            return
        }

        if (sym === 'iftrue') {
            const top = state.stack.pop()
            skipNext = !top
        } else if (sym === 'iffalse') {
            const top = state.stack.pop()
            skipNext = !!top
        } else if (Array.isArray(sym)) {
            for (const s of sym) {
                enqueue(s)
            }
        } else {
            send(sym)
        }
    }

    return (...symbols) => {
        for (const sym of symbols) {
            enqueue(sym)
        }
    }
}