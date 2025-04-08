const PLACEHOLDER = "**PLACEHOLDER**"

export function expr(arr: TemplateStringsArray, ...values: any[]) {
    let text: string = arr[0] as unknown as string
    
    for (let i = 1; i < arr.length; i++) {
        text += PLACEHOLDER + (i-1)
        text += arr[i]
    }

    return parse(text, values)
}

export function parse(expr: string, placeholders: any[]=[]): any {
    // Add a new line so that the last word is terminated
    const tok = tokens(expr + '\n')
    
    return parseSExpression(tok, placeholders)
}

const CONSTANTS: Record<string, any> = {
    'true': true,
    'false': false,
    'null': null,
    'undefined': undefined
}

export function parseSExpression(toks: any[], placeholders: any[]): any {
    const tok = toks[0]
    if (tok === '(') {
        toks.shift()

        const result: any[] = []

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

function isPunct(c: string): boolean {
    return c === '(' || c === ')'
}

function isWhitespace(c: string): boolean {
    return c === ' ' || c === '\t' || c === '\n' || c === '\r'
}
