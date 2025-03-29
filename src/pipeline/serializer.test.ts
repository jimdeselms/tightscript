import { describe, it, expect } from 'vitest';
import { serializer } from './serializer'
import { SExpression } from '.';

describe('serializer', () => {
    it('can emit a number', () => {
        const results: SExpression[] = [];
        
        const pipelineInstance = serializer((out) => {
            results.push(out);
        });

        pipelineInstance.send(100);
        pipelineInstance.send(200);
        pipelineInstance.send(300);

        // What we've done here is pushed two things onto the stack; the "200" hasn't been emitted yet
        expect(results).toEqual([100, 200, 300]);
    })

    it('can convert an S-expression into a stream', () => {
        const results: SExpression[] = [];
        
        const pipelineInstance = serializer((out) => {
            results.push(out);
        });

        pipelineInstance.send(['add', 2, 3]);
        
        expect(results).toEqual([3, 2, 'add']);
    })

    it('can convert a nested S-expression into a stream', () => {
        const results: SExpression[] = [];
        
        const pipelineInstance = serializer((out) => {
            results.push(out);
        });

        pipelineInstance.send(['add', ['mul', 2, ['negate', 3]], 5]);
        
        expect(results).toEqual([5, 3, 'negate', 2, 'mul', 'add']);
    })
})
