import { SymbolicExpression } from "./expression";
import { VMInstruction } from "./vm";

export function expressionToVm(expression: SymbolicExpression): VMInstruction[] {
    const expr = [ ...expressionToVmInternal(expression), "halt" ]
    return expr
}

export function expressionToVmInternal(expression: SymbolicExpression): VMInstruction[] {
    if (!Array.isArray(expression)) {
        return [ expression ]
    }

    const instructions: VMInstruction[] = []

    for (let i = expression.length; i >= 0; i--) {
        instructions.push(...expressionToVmInternal(expression[i]))
    }

    return instructions
}

