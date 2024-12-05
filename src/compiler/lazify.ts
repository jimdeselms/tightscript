import { BinaryExpression, Expression, Node } from 'acorn'
import { createReplacer, PLACEHOLDER1 } from './replacePlaceholder'
import { createVisitor, VisitorHandler } from './visitor'
import { getVariableName } from './getVariableName'

export type LazifyCtx = {
    variables: Expression[],
}

type LazifyHandler = VisitorHandler<Expression, [LazifyCtx]>

export const lazify = createVisitor<Expression, [LazifyCtx]>({
    Literal: (x: Node, ctx: LazifyCtx) => toVariable(LAZIFY(x), ctx),
    BinaryExpression: handleBinary as LazifyHandler,
    LogicalExpression: handleBinary as LazifyHandler,
    Program: null,
    ExpressionStatement: null,
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
    const nextVar = getVariableName(ctx.variables.length)
    ctx.variables.push(expr)

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

