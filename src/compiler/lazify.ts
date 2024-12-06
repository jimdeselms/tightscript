import { BinaryExpression, Expression, Node } from 'acorn'
import { createReplacer, PLACEHOLDER1 } from './replacePlaceholder'
import { createVisitor, VisitorHandler } from './visitor'
import { getVariableName } from './getVariableName'
import { toSha } from './toSha'

export type LazifyCtx = {
    variables: Expression[],
    shas: Map<string, number>
}

type LazifyHandler = VisitorHandler<Expression, [LazifyCtx]>

export const lazify = createVisitor<Expression, [LazifyCtx]>({
    Literal: (x: Node, ctx: LazifyCtx) => toVariable(LAZIFY(x), ctx),
    BinaryExpression: handleBinary as LazifyHandler,
    LogicalExpression: handleBinary as LazifyHandler,
    Program: null,
    ExpressionStatement: null,
    ArrowFunctionExpression: null,
    Identifier: null,
    default: (n: Node) => { throw "TBD: " + n.type }
})

function handleBinary(x: Expression, ctx: LazifyCtx): Expression {
    const binary = x as BinaryExpression
    const left = lazify(binary.left as Expression, ctx)
    const right = lazify(binary.right as Expression, ctx)

    const result: BinaryExpression = { 
        ...binary, 
        left: UNWRAPPED(left), 
        right: UNWRAPPED(right)
    }

    return toVariable(LAZIFY(result), ctx)
}

function toVariable(expr: Expression, ctx: LazifyCtx): Expression {
    const sha = toSha(expr)
    const existingIndex = ctx.shas.get(sha)
    let varIndex
    if (existingIndex === undefined) {
        varIndex = ctx.variables.length
        ctx.shas.set(sha, varIndex)
        ctx.variables.push(expr)
    } else {
        varIndex = existingIndex
    }

    const nextVar = getVariableName(varIndex)

    return {
        type: 'Identifier',
        name: nextVar,
        start: expr.start,
        end: expr.end,
    }
}

// $L = the lazy function
const LAZIFY = createReplacer<Expression>(`$L(() => ${PLACEHOLDER1})`)
const UNWRAPPED = createReplacer<Expression>(`((${PLACEHOLDER1})())`)

