import { MappingScheme, SymbolicExpression } from "./expression";

export const EVALUATE_HANDLERS: MappingScheme<SymbolicExpression, SymbolicExpression> = {
    negate: (x) => -x,
    add: (x, y) => x + y
}

