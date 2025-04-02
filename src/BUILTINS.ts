import { InputSymbol } from ".";
import { parse } from "./support/parse";

export const BUILTINS: Record<string, InputSymbol[]> = {
    negate: parse(`
        dup isNumber (
            negateNumber, 
            dup isUndefined(
                drop undefined,
                negateNumber
            )
        )
    `)
}
