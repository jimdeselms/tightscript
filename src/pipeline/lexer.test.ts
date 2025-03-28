import { describe, it, expect } from 'vitest';
import { createLexerPipeline } from './lexer'

describe('createLexerPipeline', () => {
    it('should tokenize input string into an array of tokens', () => {
        const lexer = createLexerPipeline();
        const tokens: string[] = [];
        
        const pipelineInstance = lexer((token) => {
            tokens.push(token);
        }, {});

        pipelineInstance.send('hello world this is a test');

        expect(tokens).toEqual(['hello', 'world', 'this', 'is', 'a', 'test']);
    });

    it('should handle empty input gracefully', () => {
        const lexer = createLexerPipeline();
        const tokens: string[] = [];
        
        const pipelineInstance = lexer((token) => {
            tokens.push(token);
        }, {});

        pipelineInstance.send('');

        expect(tokens).toEqual([]);
    });

    it('should handle multiple spaces between words', () => {
        const lexer = createLexerPipeline();
        const tokens: string[] = [];
        
        const pipelineInstance = lexer((token) => {
            tokens.push(token);
        }, {});

        pipelineInstance.send('hello    world   this   is   a   test');

        expect(tokens).toEqual(['hello', 'world', 'this', 'is', 'a', 'test']);
    });

    it('treats open and close parens as separate tokens', () => {
        const lexer = createLexerPipeline();
        const tokens: string[] = [];
        
        const pipelineInstance = lexer((token) => {
            tokens.push(token);
        }, {});

        pipelineInstance.send('hello(world (hello)(world) ( ) hello( world )()');

        expect(tokens).toEqual(['hello', '(', 'world', '(', 'hello', ')', '(', 'world', ')', '(', ')', 'hello', '(', 'world', ')', '(', ')']);
    })
})