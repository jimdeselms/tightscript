import { describe, it, expect } from 'vitest';
import { chainPipelines, linkPipelines } from './pipelines'

describe('linkPipelines', () =>{
    it('should link two pipelines together with ', () => {
        const inPipeline = (onMid: (mid: number) => void) => {
            return {
                send: (inValue: number) => {
                    onMid(inValue * 2);
                }
            }
        }

        const outPipeline = (onOut: (out: number) => void) => {
            return {
                send: (midValue: number) => {
                    onOut(midValue + 3);
                }
            }
        }

        const linkedPipeline = linkPipelines(inPipeline, outPipeline);

        let outputValue = 0;
        const pipelineInstance = linkedPipeline((outValue) => {
            outputValue = outValue;
        }, {});

        pipelineInstance.send(5);
        
        expect(outputValue).toBe(13); // (5 * 2) + 3
    });
})

it('can handle a chain with only a single function', () => {
    const inPipeline = (onMid: (mid: number) => void) => {
        return {
            send: (inValue: number) => {
                onMid(inValue * 2);
            }
        }
    }

    const chained = chainPipelines<number, number>(inPipeline);

    const values: number[] = [];

    const pipelineInstance = chained((val) => values.push(val), null)

    pipelineInstance.send(5)

    expect(values).toEqual([10])

    pipelineInstance.send(10)
    pipelineInstance.send(20)

    expect(values).toEqual([10, 20, 40])
})

it('can handle a chain with no functions - is the identity function', () => {
    const chained = chainPipelines<number, number>();

    const values: number[] = [];

    const pipelineInstance = chained((val) => values.push(val), null)

    pipelineInstance.send(5)

    expect(values).toEqual([5])

    pipelineInstance.send(10)
    pipelineInstance.send(20)

    expect(values).toEqual([5, 10, 20])
})

describe('chainPipelines', () => {
    it('should chain multiple pipelines together', () => {
        const pipeline1 = (onMid: (mid: number) => void) => {
            return {
                send: (inValue: number) => {
                    onMid(inValue + 1);
                }
            }
        }

        const pipeline2 = (onMid: (mid: number) => void) => {
            return {
                send: (midValue: number) => {
                    onMid(midValue * 2);
                }
            }
        }

        const pipeline3 = (onOut: (out: number) => void) => {
            return {
                send: (midValue: number) => {
                    onOut(midValue - 3);
                }
            }
        }

        const chainedPipeline = chainPipelines<number, number>(pipeline1, pipeline2, pipeline3);

        let outputValue = 0;
        const pipelineInstance = chainedPipeline((outValue) => {
            outputValue = outValue;
        }, {});

        pipelineInstance.send(5);
        
        expect(outputValue).toBe(9); // ((5 + 1) * 2) - 3
    });
})