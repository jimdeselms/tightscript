import { ExpressionStatement, Identifier, Node, Program } from 'acorn'
import { parse } from 'acorn'

export const PLACEHOLDER_ID = '$PlAce$HolDeR$'

export function createReplacer(code: string): (x: Node) => Node {
    const program = (parse(code, { ecmaVersion: 2020 }) as Program)
    const ast = (program.body[0] as ExpressionStatement).expression

    return (replaceWith: Node) => replacePlaceholder(ast, replaceWith)
}

export function replacePlaceholder(node: Node, replaceWith: Node): Node {
    if (typeof node !== 'object' || node === null) {
        return node
    }

    if (node.type === 'Identifier' && (node as Identifier).name === PLACEHOLDER_ID) {
        return replaceWith
    }

    return Object.fromEntries(Object.entries(node).map(([key, value]) => {
        if (Array.isArray(value)) {
            return [key, value.map(v => replacePlaceholder(v, replaceWith))]
        } else {
            return [key, replacePlaceholder(value, replaceWith)] 
        }
    }))
}