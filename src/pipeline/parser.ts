import { Pipeline, SExpression } from './index.js';

export type ParserState = {
    currLists: SExpression[]
}

export const INITIAL_STATE: ParserState = {
    currLists: []
}

export const parser: Pipeline<string, SExpression, ParserState> = (onOut: (value: SExpression) => void, initialState?: ParserState) => {
    const parserState = structuredClone({ ...(initialState ?? {}), ...INITIAL_STATE }) as ParserState;

    return {
        send: (token: string) => {
            if (token === '(') {
                parserState.currLists.push([])
            } else if (token === ')') {
                const resultExpr = parserState.currLists.pop()
                if (parserState.currLists.length === 0) {
                    // This was the final close parenthesis, so we can emit the result
                    onOut(resultExpr)
                } else {
                    // We're closing one level of nesting, so we put this list at the end of the previous list.
                    (parserState.currLists[parserState.currLists.length - 1]! as SExpression[]).push(resultExpr)
                }
            } else {
                const typedToken = getTypedToken(token)
                // If this is just a token at the root level, emit it directly
                // Otherwise, add it to the end of the current list
                if (parserState.currLists.length === 0) {
                    onOut(typedToken)
                } else {
                    (parserState.currLists[parserState.currLists.length - 1]! as SExpression[]).push(typedToken)
                }
            }
        }
    };
}

function getTypedToken(token: string): string | number | boolean | null | undefined {
    if (token === 'true') return true
    if (token === 'false') return false
    if (token === 'null') return null
    if (token === 'undefined') return undefined
    const num = Number(token)
    if (!isNaN(num)) return num
    return (token.startsWith('"') && token.endsWith('"')) || (token.startsWith("'") && token.endsWith("'"))
        ? token.slice(1, -1) // Remove quotes
        : token // Return as is if not a quoted string
}



/**
 * 
 * inputTokens: (1 (2))
 * currLists: []
 * 
 * currLists: [[]]
 * inputTokens: 1 (2))
 * 
 * currLists: [[1]]
 * inputTokens: (2))
 * 
 * currLists: [[1], []]
 * inputTokens: 2))
 * 
 * currLists: [[1], [2]]
 * inputTokens: ))
 * 
 * currLists: [1, [2]]
 * inputTokens: )
 * 
 * EMIT
 * 
 * 
 */