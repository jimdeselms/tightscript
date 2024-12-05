import { BinaryExpression, Expression, Node } from 'acorn'
import { createReplacer, PLACEHOLDER1 } from './replacePlaceholder'
import { createVisitor, VisitorHandler } from './visitor'

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
    const nextVar = `$${ctx.variables.length}`
    ctx.variables.push(expr)

    return {
        type: 'Identifier',
        name: nextVar,
        start: expr.start,
        end: expr.end,
    }
}

const LAZIFY = createReplacer<Expression>(`LAZY(() => ${PLACEHOLDER1})`)
const UNWRAPPED = createReplacer<Expression>(`((${PLACEHOLDER1})())`)

