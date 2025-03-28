import { Pipeline } from './index.js';

export function createLexerPipeline(): Pipeline<string, string, unknown> {
    const fn = (onOut: (value: unknown) => void) => {
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

function splitIntoWords(str: string): string[] {
    return str.split(/\s+/).filter(word => word.length > 0);
}