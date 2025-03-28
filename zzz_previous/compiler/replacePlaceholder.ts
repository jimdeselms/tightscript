import { Expression, ExpressionStatement, Identifier, Node, Program } from 'acorn'
import { parse } from 'acorn'
import { isNode } from './isNode'

const PLACEHOLDER_BASE = "$PlAce$HolDeR$"
export const PLACEHOLDER1 = PLACEHOLDER_BASE + "1"
export const PLACEHOLDER2 = PLACEHOLDER_BASE + "2"
export const PLACEHOLDER3 = PLACEHOLDER_BASE + "3"
export const PLACEHOLDER4 = PLACEHOLDER_BASE + "4"

export type Replacer<T extends Node=Node> = (...replaceWith: Node[]) => T

export function createReplacer<T extends Node=Node>(code: string): Replacer<T> {
    const program = (parse(code, { ecmaVersion: 2020 }) as Program)

    // If there are multiple statements, take the last one.
    const ast = (program.body.at(-1) as ExpressionStatement).expression

    return (...replaceWith: Node[]) => replacePlaceholder(ast, ...replaceWith) as T
}

export function compileString(code: string): Expression {
    const program = (parse(code, { ecmaVersion: 2020 }) as Program)

    // If there are multiple statements, take the last one.
    const ast = (program.body.at(-1) as ExpressionStatement).expression

    return ast as Expression
}

export function replacePlaceholder(node: Node, ...replaceWith: Node[]): Node {
    if (typeof node !== 'object' || node === null) {
        return node
    }

    if (node.type === 'Identifier' && (node as Identifier).name.startsWith(PLACEHOLDER_BASE)) {
        const id = (node as Identifier).name
        const lastDollar = id.lastIndexOf('$')
        const placeholderNumber = parseInt(id.slice(lastDollar + 1))
        const value = replaceWith[placeholderNumber-1]
        return toNode(value)
    }

    return Object.fromEntries(Object.entries(node).map(([key, value]) => {
        if (Array.isArray(value)) {
            return [key, value.map(v => replacePlaceholder(v, ...replaceWith))]
        } else {
            return [key, replacePlaceholder(value, ...replaceWith)] 
        }
    }))
}

function toNode(x: any): Node {
    if (isNode(x)) {
        return x
    }

    return {
        type: 'Literal',
        value: x,
        start: 0,
        end: 0,
    } as Node
}