import { describe, it, expect } from 'vitest';
import { parser } from './parser'
import { SExpression } from '.';

describe('createParserPipeline', () => {
    it('can parse a single string token', () => {
        const asts: SExpression[] = [];
        
        const pipelineInstance = parser((ast) => {
            asts.push(ast);
        });

        pipelineInstance.send('hello');

        expect(asts).toEqual(["hello"]);
    })

    it('can parse a single number token', () => {
        const asts: SExpression[] = [];
        
        const pipelineInstance = parser((ast) => {
            asts.push(ast);
        });

        pipelineInstance.send('42');

        expect(asts).toEqual([42]);
    })

    it('can parse a boolean token', () => {
        const asts: SExpression[] = [];
        
        const pipelineInstance = parser((ast) => {
            asts.push(ast);
        });

        pipelineInstance.send("false");

        expect(asts).toEqual([false]);
    })

    it('can parse a simple quoted string', () => {
        const asts: SExpression[] = [];
        
        const pipelineInstance = parser((ast) => {
            asts.push(ast);
        });

        pipelineInstance.send('hello');

        expect(asts).toEqual(["hello"]);
    })

    it('can parse an empty list', () => {
        const asts: SExpression[] = [];
        
        const pipelineInstance = parser((ast) => {
            asts.push(ast);
        });

        pipelineInstance.send('(')
        pipelineInstance.send(')')

        expect(asts).toEqual([[]]);
    })

    it('can parse a list with two elements in it', () => {
        const asts: SExpression[] = [];
        
        const pipelineInstance = parser((ast) => {
            asts.push(ast);
        });

        pipelineInstance.send('(')
        pipelineInstance.send('10')
        pipelineInstance.send('20')
        pipelineInstance.send(')')

        expect(asts).toEqual([[10, 20]]);
    })
})
