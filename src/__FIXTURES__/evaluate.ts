import { InputSymbol, OutputSymbol } from "..";
import { runMachine } from "../runMachine";

export function evaluate(input: InputSymbol[]): OutputSymbol[] {
    const state = { stack: [] }
    const result: OutputSymbol[] = []

    for (const i of input) {
        runMachine(i, val => result.push(val), state)
    }

    runMachine('emit', val => result.push(val), state)

    return result
}
