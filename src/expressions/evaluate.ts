import { MappingScheme } from "./expression";

export const EVALUATE_HANDLERS: MappingScheme = {
    negate: (x) => -x,
    add: (x, y) => x + y
}

