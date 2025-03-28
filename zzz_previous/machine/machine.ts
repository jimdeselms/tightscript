import { Expr, isExpr, isSExpression, SExpression } from "./expr";
import { Registry } from "./registry";

export type Handler<TOut> = (args: Expr[], machine: Machine<TOut>) => TOut | Expr

export type MachineOpts = {
    processChildrenFirst?: boolean
    fieldName: string
}

export class Machine<TOut=Expr> {
    private handlers: Record<string, Handler<TOut>>
    private registry: Registry
    private toExpr: (s: TOut) => Expr
    private opts: MachineOpts

    constructor(
        handlers: Record<string, Handler<TOut>>, 
        registry: Registry, 
        toExpr: (s: TOut) => Expr,
        opts: MachineOpts
    ) {
        this.handlers = handlers
        this.registry = registry
        this.toExpr = toExpr
        this.opts = opts
    }

    process(expr: Expr | SExpression): Expr {
        expr = isSExpression(expr)
            ? this.registry.register(expr)
            : expr

        // Have we already processed this expression? Then just return 
        // the cached version.
        if (expr[this.opts.fieldName]) {
            return expr[this.opts.fieldName] as Expr
        }

        let handler: Handler<TOut>
        let result: TOut | Expr

        if (expr.isScalar) {
            const type = expr.sExpression === null
                ? 'null'
                : typeof expr.sExpression

            handler = this.handlers[type]
            if (!handler) {
                throw `Handler ${type} not found`
            }

            result = handler([expr], this)
        } else {
            const sExpr = expr.sExpression as [string, ...SExpression[]]
            let [primitive, ...children] = sExpr

            const childrenExprs = this.opts.processChildrenFirst
                ? children.map(c => this.process(c))
                : children.map(c => this.registry.register(c))

            // If an SExpression is an array, then the first element is the name
            // of the primitive.
            handler = this.handlers[primitive]
            if (!handler) {
                throw `Handler ${primitive} not found`
            }

            result = handler(childrenExprs, this)
        }

        const resultExpr = isExpr(result)
            ? result
            : this.toExpr(result)

        // Associate this result with the original expression
        // so that we don't have to process it again.
        expr[this.opts.fieldName] = resultExpr

        return resultExpr
    }
}
