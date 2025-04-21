const PLACEHOLDER = "**PLACEHOLDER**"

export function expr(arr, ...values) {
    let text = arr[0]
    
    for (let i = 1; i < arr.length; i++) {
        text += PLACEHOLDER + (i-1)
        text += arr[i]
    }

    const result = parse(text, values)

    return result
}

export function parse(expr, placeholders=[]) {
    if (typeof expr === 'number' || typeof expr === 'boolean' || expr === null || expr === undefined) {
        return expr
    }

    // Add a new line so that the last word is terminated
    const tok = tokens(expr + '\n')
    
    const result = parseSExpression(tok, placeholders)
    return result
}

const CONSTANTS = {
    'true': true,
    'false': false,
    'null': null,
    'undefined': undefined,
    '$': ['arg', 0],
}

export function parseSExpression(toks, placeholders) {
    let tok = toks[0]
    if (tok[0] === '"') {
        toks.shift()
        return tok.slice(1, -1)
    }

    if (tok === '(') {
        toks.shift()

        const result = []

        while (toks.length > 0 && toks[0] !== ')') {
            result.push(parseSExpression(toks, placeholders))
        }

        if (toks.length === 0) {
            throw new Error("Expected matching parenthesis")
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

        if (tok[0] === '$') {
            const argIdx = parseInt(tok.slice(1))
            return isNaN(argIdx)
                ? argIdx
                : ['arg', argIdx]
        }

        if (tok === '-') {
            const asnum = parseNumber[tok[0]]
            if (!isNaN(asnum)) {
                toks.shift()
                return -asnum
            }
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
                    curr = '"'
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
                } else if (char === '-') {
                    state = 'minus'
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

function isPunct(c) {
    return c === '(' || c === ')'
}

function isWhitespace(c) {
    return c === ' ' || c === '\t' || c === '\n' || c === '\r'
}


export function exprToString(expr) {
    if (Array.isArray(expr)) {
        if (expr[0] === 'arg') {
            return '$' + expr[1]
        }
        return `(${expr.map(exprToString).join(' ')})`
    } else if (expr instanceof Error) {
        return `(error ${expr.message})`
    } else {
        return typeof expr === 'string' && expr.indexOf(' ') > -1 ? `"${expr}"` : String(expr)
    }
}