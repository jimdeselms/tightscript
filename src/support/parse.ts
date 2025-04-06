import { InputSymbol } from ".."

export function parse(expr: string): InputSymbol[] {

    expr += '\n'

    const toks = tokens(expr)

    return parseExpr(toks)
}

function parseExpr(tokens: string[]): InputSymbol[] {
    const result: InputSymbol[] = []

    while (true) {
        const curr = tokens.shift()
        if (curr === '(') {
            result.push([ parseExpr(tokens), parseExpr(tokens) ])
        } else if (curr === '[') {
            result.push([ parseExpr(tokens) ])
        } else if (curr === ')' || curr === ']' || curr === ',' || curr === undefined) {
            return result
        } else {
            const asnum = Number(curr)
            if (isNaN(asnum)) {
                const value = curr in CONSTANTS ? CONSTANTS[curr] : curr
                result.push(value)
            } else {
                result.push(asnum)
            }
        }
    }
}

const CONSTANTS: Record<string, any> = {
    true: true,
    false: false,
    null: null,
    undefined: undefined
}

function tokens(input: string): any {
    let curr = ""
    let state = 'start'
    const result = []
    
    for (const char of input) {
        switch (state) {
            case 'start':
                if (isPunct(char)) {
                    result.push(char)
                } else if (isWhitespace(char)) {
                    // do nothing
                } else if (char === '"') {
                    curr += '"'
                    state = 'string'
                } else {
                    curr += char
                    state = 'word'
                }
                break
            case 'word':
                if (isWhitespace(char)) {
                    result.push(curr)
                    curr = ""
                    state = 'start'
                } else if (isPunct(char)) {
                    result.push(curr)
                    curr = ""
                    state = 'start'
                    result.push(char)
                } else {
                    curr += char
                }
                break
            case 'string':
                if (char === '"') {
                    result.push(curr + '"')
                    curr = ""
                    state = 'start'
                } else {
                    curr += char
                }
                break
            default: throw "Unpexected lexer state"
        }
    }

    return result
}

function isPunct(c: string): boolean {
    return c === '(' || c === ')' || c === ',' || c === '[' || c === ']'
}

function isWhitespace(c: string): boolean {
    return c === ' ' || c === '\t' || c === '\n' || c === '\r'
}
