import { Pipeline, SExpression } from './index.js';

export type LexerState = {
    curr: string
    state: LexerMachineState
}

export type LexerMachineState = "start" | "word" 

export const INITIAL_STATE: LexerState = {
    curr: "",
    state: "start"
}

export const lexer: Pipeline<string, string, LexerState> = (onOut: (value: string) => void, initialState?: LexerState) => {
    const parserState = structuredClone({ ...(initialState ?? {}), ...INITIAL_STATE }) as LexerState;

    let nextToken: string | null = null

    return {
        send: (stringOfCharacters: string) => {

            for (const nextChar of stringOfCharacters + '\n') {
                if (nextToken) {
                    onOut(nextToken)
                    nextToken = null
                }

                switch (parserState.state) {
                    case 'start':
                        if (nextChar === '(' || nextChar === ')') {
                            // Emit the paren directly
                            onOut(nextChar)
                        } else if (nextChar === ' ' || nextChar === '\n' || nextChar === '\t') {
                            // Do nothing
                        } else {
                            // Start collecting a word
                            parserState.curr = nextChar
                            parserState.state = 'word'
                        }
                        break;
                    case 'word':
                        if (isWordChar(nextChar)) {
                            parserState.curr += nextChar
                        } else {
                            if (nextChar !== ' ' && nextChar !== '\n' && nextChar !== '\t') {
                                nextToken = nextChar
                            }
                            
                            parserState.state = 'start'
                            onOut(parserState.curr)
                            parserState.curr = ""
                        }
                        break
                    default:
                        throw "ERROR"
                }
            }
        }
    };
}

export function createLexerPipeline2(): Pipeline<string, string, unknown> {
    const fn = (onOut: (value: SExpression) => void) => {
        return {
            send: (input: string) => {
                let curr = input

                while (curr.length > 0) {
                    // Find the next paren (open or closed)
                    const openParenIndex = curr.indexOf('(') === -1 ? Infinity : curr.indexOf('(')
                    const closeParenIndex = curr.indexOf(')') === -1 ? Infinity : curr.indexOf(')')
                    const nextParenIndex = Math.min(openParenIndex, closeParenIndex)

                    if (nextParenIndex === Infinity) {
                        const words = splitIntoWords(curr)
                        words.forEach(word => onOut(word))
                        curr = ""
                    } else {
                        const firstPart = curr.slice(0, nextParenIndex).trim()
                        const parenPart = curr[nextParenIndex]
                        const secondPart = curr.slice(nextParenIndex + 1).trim()

                        if (firstPart) { 
                            // Now split into individual words
                            const words = splitIntoWords(firstPart)
                            words.forEach(word => onOut(word))
                        }

                        onOut(parenPart)

                        if (secondPart) { 
                            curr = secondPart
                        } else {
                            curr = ""
                        }
                    }
                }
            }
        };
    }
    
    return fn as Pipeline<string, string, unknown>;
}

export function createLexerPipeline(): Pipeline<string, string, LexerState> {
    const fn = (onOut: (value: string) => void, initialState?: LexerState) => {
        const parserState = structuredClone({ ...(initialState ?? {}), ...INITIAL_STATE }) as LexerState;

        let nextToken: string | null = null

        return {
            send: (stringOfCharacters: string) => {

                for (const nextChar of stringOfCharacters + '\n') {
                    if (nextToken) {
                        onOut(nextToken)
                        nextToken = null
                    }

                    switch (parserState.state) {
                        case 'start':
                            if (nextChar === '(' || nextChar === ')') {
                                // Emit the paren directly
                                onOut(nextChar)
                            } else if (nextChar === ' ' || nextChar === '\n' || nextChar === '\t') {
                                // Do nothing
                            } else {
                                // Start collecting a word
                                parserState.curr = nextChar
                                parserState.state = 'word'
                            }
                            break;
                        case 'word':
                            if (isWordChar(nextChar)) {
                                parserState.curr += nextChar
                            } else {
                                if (nextChar !== ' ' && nextChar !== '\n' && nextChar !== '\t') {
                                    nextToken = nextChar
                                }
                                
                                parserState.state = 'start'
                                onOut(parserState.curr)
                                parserState.curr = ""
                            }
                            break
                        default:
                            throw "ERROR"
                    }
                }
            }
        };
    }
    return fn
}

// export function createLexerPipeline2(): Pipeline<string, string, unknown> {
//     const fn = (onOut: (value: SExpression) => void) => {
//         return {
//             send: (input: string) => {
//                 let curr = input

//                 while (curr.length > 0) {
//                     // Find the next paren (open or closed)
//                     const openParenIndex = curr.indexOf('(') === -1 ? Infinity : curr.indexOf('(')
//                     const closeParenIndex = curr.indexOf(')') === -1 ? Infinity : curr.indexOf(')')
//                     const nextParenIndex = Math.min(openParenIndex, closeParenIndex)

//                     if (nextParenIndex === Infinity) {
//                         const words = splitIntoWords(curr)
//                         words.forEach(word => onOut(word))
//                         curr = ""
//                     } else {
//                         const firstPart = curr.slice(0, nextParenIndex).trim()
//                         const parenPart = curr[nextParenIndex]
//                         const secondPart = curr.slice(nextParenIndex + 1).trim()

//                         if (firstPart) { 
//                             // Now split into individual words
//                             const words = splitIntoWords(firstPart)
//                             words.forEach(word => onOut(word))
//                         }

//                         onOut(parenPart)

//                         if (secondPart) { 
//                             curr = secondPart
//                         } else {
//                             curr = ""
//                         }
//                     }
//                 }
//             }
//         };
//     }
    
//     return fn as Pipeline<string, string, unknown>;
// }

function splitIntoWords(str: string): string[] {
    return str.split(/\s+/).filter(word => word.length > 0);
}

const NON_WORD_CHARS = '\n\t\r ()"\'';

function isWordChar(nextChar: string): boolean {
    return !NON_WORD_CHARS.includes(nextChar)
}