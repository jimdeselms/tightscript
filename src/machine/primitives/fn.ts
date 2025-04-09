// @ts-nocheck

import { machine } from '../machine'

export const fn = (state) => {
        const { stack, argStack } = state

        const fnInstructions = stack.pop()

        const resultFunction = (arg) => {
            argStack.push(arg)
            state.input.unshift(...fnInstructions)
            while (state.input.length > 0) {
                machine(state)
            }
    
            const result = stack.pop()
            argStack.pop()

            return result
        }

        stack.push(resultFunction)
    }