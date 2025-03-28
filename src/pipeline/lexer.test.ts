import { describe, it, expect } from 'vitest';
import { lexer } from './lexer'

describe('lexer', () => {
    it('should tokenize input string into an array of tokens', () => {
        const tokens: string[] = [];
        
        const pipelineInstance = lexer((token) => {
            tokens.push(token);
        });

        pipelineInstance.send('hello world this is a test');

        expect(tokens).toEqual(['hello', 'world', 'this', 'is', 'a', 'test']);
    });

    it('should handle empty input gracefully', () => {
        const tokens: string[] = [];
        
        const pipelineInstance = lexer((token) => {
            tokens.push(token);
        });

        pipelineInstance.send('');

        expect(tokens).toEqual([]);
    });

    it('should handle multiple spaces between words', () => {
        const tokens: string[] = [];
        
        const pipelineInstance = lexer((token) => {
            tokens.push(token);
        });

        pipelineInstance.send('hello    world   this   is   a   test');

        expect(tokens).toEqual(['hello', 'world', 'this', 'is', 'a', 'test']);
    });

    it('treats open and close parens as separate tokens', () => {
        const tokens: string[] = [];
        
        const pipelineInstance = lexer((token) => {
            tokens.push(token);
        });

        pipelineInstance.send('hello(world');

        expect(tokens).toEqual(['hello', '(', 'world']);

        // pipelineInstance.send('hello(world (hello)(world) ( ) hello( world )()');

        // expect(tokens).toEqual(['hello', '(', 'world', '(', 'hello', ')', '(', 'world', ')', '(', ')', 'hello', '(', 'world', ')', '(', ')']);
    })
})