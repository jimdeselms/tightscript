import { ArrowFunctionExpression, BinaryExpression, Expression, Identifier, Node } from 'acorn'
import { compileString, createReplacer, PLACEHOLDER1, PLACEHOLDER2, Replacer } from '../replacePlaceholder'
import { createVisitor, VisitorHandler } from '../visitor'
import { getVariableName } from '../getVariableName'
import { toSha } from '../toSha'

export type LazifyCtx = {
    variables: Expression[],
    shas: Map<string, number>,
    params: string[][]
}

type LazifyHandler = VisitorHandler<Expression, [LazifyCtx]>

export const lazify = createVisitor<Expression, [LazifyCtx]>({
    Literal: (x: Node, ctx: LazifyCtx) => toVariable(CONSTANT(x), ctx),
    BinaryExpression: handleBinary as LazifyHandler,
    LogicalExpression: handleBinary as LazifyHandler,
    Program: null,
    ExpressionStatement: null,
    ArrowFunctionExpression: handleArrowFunction,
    Identifier: handleIdentifier,
    default: (n: Node) => { throw "TBD: " + n.type }
})

function handleIdentifier(x: Expression, ctx: LazifyCtx): Expression {
    const id = x as Identifier

    const argIndex = ctx.params[0].indexOf(id.name)

    const argExpr = compileString(`($L($ => () => $[0][${argIndex}]($)()))`)

    return argExpr
}

function handleArrowFunction(x: Expression, ctx: LazifyCtx): Expression {
    // For now assume that it's an expression;
    // TODO - handle BlockStatement.
    const arrow = x as ArrowFunctionExpression

    const args = arrow.params.map(p => (p as Identifier).name)
    ctx.params.unshift(args)
    const expr = lazify(arrow.body as Expression, ctx)
    ctx.params.shift()
    return toVariable(ARROW_FUNCTION(expr), ctx)
}

// An arrow function is also an expression that takes an argument '$', and it returns a void function
// That void function, instead of returning a value, returns a function.
// That function takes an expression and returns the lazy value of that expression when resolved with the argument.
const ARROW_FUNCTION = createReplacer<Expression>(`
    $L($ => () => {
        return (...$$) => {
            $.unshift($$)
            const $R = (${PLACEHOLDER1})($)
            $.shift()
            return $R
        }
    })`)

function handleBinary(x: Expression, ctx: LazifyCtx): Expression {
    const binary = x as BinaryExpression
    const left = lazify(binary.left as Expression, ctx)
    const right = lazify(binary.right as Expression, ctx)

    const replacer = BINARY_REPLACERS[binary.operator]
    const result = replacer(left, right)

    return toVariable(result, ctx)
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

const BINARY_REPLACERS: Record<string, Replacer<Expression>>  = {
    '+': createReplacer<Expression>(`$L($ => () => ${PLACEHOLDER1}($)() + ${PLACEHOLDER2}($)())`),
    '*': createReplacer<Expression>(`$L($ => () => ${PLACEHOLDER1}($)() * ${PLACEHOLDER2}($)())`),
    '-': createReplacer<Expression>(`$L($ => () => ${PLACEHOLDER1}($)() - ${PLACEHOLDER2}($)())`),
    '/': createReplacer<Expression>(`$L($ => () => ${PLACEHOLDER1}($)() / ${PLACEHOLDER2}($)())`),
    '&&': createReplacer<Expression>(`$L($ => () => ${PLACEHOLDER1}($)() && ${PLACEHOLDER2}($)())`),
    '||': createReplacer<Expression>(`$L($ => () => ${PLACEHOLDER1}($)() || ${PLACEHOLDER2}($)())`),
}
const CONSTANT = createReplacer<Expression>(`$L(() => () => ${PLACEHOLDER1})`)

