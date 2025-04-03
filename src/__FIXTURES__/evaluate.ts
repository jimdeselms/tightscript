import { InputSymbol, OutputSymbol } from "..";
import { runMachine } from "../runMachine";

export function evaluate(input: InputSymbol[]): OutputSymbol {
    const state = { stack: [] }
    const result: OutputSymbol[] = []

    for (const i of input) {
        runMachine(i, val => result.push(val), state)
    }

    if (state.stack.length !== 1) {
        throw "Expected a stack with a single element in it"
    }

    return state.stack.pop()
}
