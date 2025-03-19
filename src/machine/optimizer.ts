import { Expr, SExpression } from "./expr";
import { Handler, Machine } from "./machine";
import { Registry } from "./registry";

export class Optimizer extends Machine<SExpression> {
    constructor(registry: Registry) {
        super(OPTIMIZER_HANDLERS, registry, e => registry.register(e),
        {
            processChildrenFirst: true,
            fieldName: 'optimized'
        })
    }
}

const IDENTITY: Handler<SExpression> = (args: Expr[]) => args[0]

export const OPTIMIZER_HANDLERS: Record<string, Handler<SExpression>> = {
    number: IDENTITY,
    string: IDENTITY,

    negate: (args: Expr[], optimizer: Optimizer) => {
        // We should be able to assume that the children are already optimized.
        const rawArg = args[0].sExpression
        const arg = optimizer.process(rawArg)
        if (arg.isScalar) {
            return -(arg.sExpression as number)
        } else {
            return ['negate', arg.sExpression] as SExpression
        }
    }
}
