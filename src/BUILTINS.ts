import { InputSymbol } from ".";

export const BUILTINS: Record<string, InputSymbol[]> = {
    negate: ['dup', 'isNumber', [['negateNumber'], ['error']]]
}
