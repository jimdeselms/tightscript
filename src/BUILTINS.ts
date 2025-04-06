import { InputSymbol } from ".";
import { parse } from "./support/parse";

export const BUILTINS: Record<string, InputSymbol[]> = {
    negate: parse(`
        dup isUndefined 
            [drop undefined]
            [dup isNumber
                [negateNumber]
                [drop "not a number" error] cond
            ] cond
    `),

    // Add requires that the second item on the stack must aleady been checked to see if it is a number.
    add: parse(`
        dup isUndefined
            [drop drop undefined]
            [dup isNumber 
                [addNumbers]
                [drop drop "not a number" error] cond
            ] cond
        `),

    assertNumber: parse(`
        dup isUndefined
            [drop undefined false]
            [dup isNumber
                [true]
                [ drop "not a number" error false] cond
            ] cond
    `)
}
