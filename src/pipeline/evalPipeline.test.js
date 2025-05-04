import { createEvalPipeline } from './evalPipeline'

describe('evalPipeline', () => {
    it('number', () => {
        const pipeline = createEvalPipeline()
        expect(pipeline(1)).toBe(1)
    })
})