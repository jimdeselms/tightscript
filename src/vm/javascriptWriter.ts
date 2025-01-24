import { Step } from './vm'

type Sym = string | number

const symbolsToJavascript: Step<Sym, string, string> = (state, input) => {
    if (typeof input === 'number') {
        return [`$.push(${input})`]
    }

    switch (input) {
        case 'add': return [`$.push($.pop() + $.pop())`]
        case 'negate': return ["$.push(-$.pop())"]
    }

    return []
}

export function toJavascript(symbols: Sym[]): string {
    const preamble = `(function () {
        const $ = [];
    `

    const lines = []

    for (const symbol of symbols) {
        const symbols = symbolsToJavascript('', symbol)
        lines.push(...symbols)
    }

    const postamble = `;return $.pop(); 
    })()`

    return preamble + lines.join(';\n') + postamble
}
