export function getSymbolMachineHandler(symbol) {
    if (typeof symbol === 'number' || typeof symbol === 'boolean' || symbol == null) {
        return (state) => {
            state.stack.push(symbol)
        }
    }

    if (typeof symbol === 'string') {
        return (state) => {
            const handler = handlers[symbol]

            if (handler) {
                handler(state)
            } else {
                throw "Unknown symbol " + symbol
            }
        }
    }
}

const handlers = {
    out: (state) => {
        const value = state.stack.pop()
        state.onOutputSymbol(value)
    },

    halt: (state) => {
        state.publicState.halt = true
    },

    lt: (state) => {
        const a = state.stack.pop()
        const b = state.stack.pop()

        state.stack.push(b < a)
    }
}