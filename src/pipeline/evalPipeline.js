import { pipeline } from './pipeline.js'

export function createEvalPipeline() {
    return pipeline(createHandlers())
}

function createHandlers() {
    return {
        number: (val) => val,
    }
}
