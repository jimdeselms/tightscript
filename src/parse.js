const PLACEHOLDER = "**PLACEHOLDER**"

export function expr(arr, ...values) {
    let text = arr[0]
    
    for (let i = 1; i < arr.length; i++) {
        text += PLACEHOLDER + (i-1)
        text += arr[i]
    }

    return parse(text, values)
}

export function parse(expr, placeholders=[]) {
    // Add a new line so that the last word is terminated
    const tok = tokens(expr + '\n')
    
    return parseSExpression(tok, placeholders)
}

const CONSTANTS = {
    'true': true,
    'false': false,
    'null': null,
    'undefined': undefined
}

export function parseSExpression(toks, placeholders) {
    const tok = toks[0]
    if (tok === '(') {
        toks.shift()

        const result = []

        while (toks[0] !== ')') {
            result.push(parseSExpression(toks, placeholders))
        }

        toks.shift()

        return result
    } else {
        toks.shift()

        if (tok in CONSTANTS) {
            return CONSTANTS[tok]
        }

        if (tok.startsWith(PLACEHOLDER)) {
            const val = parseInt(tok.substring(PLACEHOLDER.length))
            return placeholders[val]
        }

        const asnum = Number(tok)
        return isNaN(asnum) ? tok : asnum
    }
}

function tokens(input) {
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
                    result.push(curr)
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

function isPunct(c) {
    return c === '(' || c === ')'
}

function isWhitespace(c) {
    return c === ' ' || c === '\t' || c === '\n' || c === '\r'
}
