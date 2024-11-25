import { ExpressionStatement, Identifier, Node, Program } from 'acorn'
import { parse } from 'acorn'

const PLACEHOLDER_BASE = "$PlAce$HolDeR$"
export const PLACEHOLDER1 = PLACEHOLDER_BASE + "1"
export const PLACEHOLDER2 = PLACEHOLDER_BASE + "2"
export const PLACEHOLDER3 = PLACEHOLDER_BASE + "3"
export const PLACEHOLDER4 = PLACEHOLDER_BASE + "4"

export function createReplacer(code: string): (...replaceWith: Node[]) => Node {
    const program = (parse(code, { ecmaVersion: 2020 }) as Program)
    const ast = (program.body[0] as ExpressionStatement).expression

    return (...replaceWith: Node[]) => replacePlaceholder(ast, ...replaceWith)
}

export function replacePlaceholder(node: Node, ...replaceWith: Node[]): Node {
    if (typeof node !== 'object' || node === null) {
        return node
    }

    if (node.type === 'Identifier' && (node as Identifier).name.startsWith(PLACEHOLDER_BASE)) {
        const id = (node as Identifier).name
        const lastDollar = id.lastIndexOf('$')
        const placeholderNumber = parseInt(id.slice(lastDollar + 1))
        return replaceWith[placeholderNumber-1]
    }

    return Object.fromEntries(Object.entries(node).map(([key, value]) => {
        if (Array.isArray(value)) {
            return [key, value.map(v => replacePlaceholder(v, ...replaceWith))]
        } else {
            return [key, replacePlaceholder(value, ...replaceWith)] 
        }
    }))
}