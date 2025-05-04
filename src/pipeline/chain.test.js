import { chain } from './chain.js'
import { pipeline } from './pipeline.js'

describe('chain', () => {
    it('can chain pipelines', () => {
        const stringToNumberStep = pipeline({ string: x => Number(x) })
        const evalStep = pipeline({ add: (x, y) => x + y, negate: (x) => -x, number: x=>x })
        const toStringStep = pipeline({ number: x => String(x) })

        const chained = chain(stringToNumberStep, evalStep, toStringStep)
        const result = chained(['add', ['negate', "3"], "5"])

        expect(result).toBe("2")
    })
})