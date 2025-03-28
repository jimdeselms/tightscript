import { describe, it, expect } from 'vitest';
import { createParserPipeline } from './parser'

describe('createParserPipeline', () => {
    it('can parse a single string token', () => {
        const parser = createParserPipeline();
        const asts: unknown[] = [];
        
        const pipelineInstance = parser((ast) => {
            asts.push(ast);
        });

        pipelineInstance.send('hello');

        expect(asts).toEqual(["hello"]);
    })

    it('can parse a single number token', () => {
        const parser = createParserPipeline();
        const asts: unknown[] = [];
        
        const pipelineInstance = parser((ast) => {
            asts.push(ast);
        });

        pipelineInstance.send('42');

        expect(asts).toEqual([42]);
    })

    it('can parse a boolean token', () => {
        const parser = createParserPipeline();
        const asts: unknown[] = [];
        
        const pipelineInstance = parser((ast) => {
            asts.push(ast);
        });

        pipelineInstance.send('true');

        expect(asts).toEqual([true]);
    })

    it('can parse a simple quoted string', () => {
        const parser = createParserPipeline();
        const asts: unknown[] = [];
        
        const pipelineInstance = parser((ast) => {
            asts.push(ast);
        });

        pipelineInstance.send('"true"');

        expect(asts).toEqual(['true']);
    })
})
