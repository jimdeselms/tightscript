export type Token = {
    kind: string
    text: string
}

export async function* lexer(symbols: AsyncIterable<string>): AsyncIterable<Token> {
    let state = 'start'
    let curr = ''
    let putback: string | null = null

    const iterator = append(symbols, ' ')[Symbol.asyncIterator]()

    let ch: string | null = null

    while (true) {
        if (putback == null) {
            const result = await iterator.next()
            if (result.done) {
                break
            }
            ch = result.value
        } else {
            ch = putback
            putback = null
        }

        switch (state) {
            case 'start':
                if (isWhitespace(ch)) {
                    break
                } else if (isDigit(ch)) {
                    curr += ch
                    state = 'integer'
                    break
                } else if (isAlpha(ch)) {
                    curr += ch
                    state = 'id'
                    break
                } else if (isPunct(ch)) {
                    yield {
                        kind: ch,
                        text: ch,
                    }
                }
                break
            case 'integer': 
                if (isDigit(ch)) {
                    curr += ch
                } else {
                    state = 'start'
                    yield { kind: 'number', text: curr }
                    curr = ''
                    putback = ch
                }
                break
            case 'id': 
                if (isAlpha(ch) || isDigit(ch)) {
                    curr += ch
                } else {
                    state = 'start'
                    yield { kind: 'id', text: curr }
                    curr = ''
                    putback = ch
                }
                break
        }
    }
}

async function* append<T>(iter: AsyncIterable<T>, ...items: T[]): AsyncIterable<T> {
    for await (const x of iter) {
        yield x
    }

    yield *items
}

function isWhitespace(ch: string): boolean {
    return ch === ' ' || ch === '\t' || ch === '\n' || ch === '\r'
}

function isDigit(ch: string): boolean {
    return ch >= '0' && ch <= '9'
}

function isAlpha(ch: string): boolean {
    return (ch >= 'a' && ch <= 'z') || (ch >= 'A' && ch <= 'Z') || ch === '_'
}

const PUNCT = "()"

function isPunct(ch: string): boolean {
    return PUNCT.includes(ch)
}