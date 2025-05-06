import { describe, it, expect } from 'vitest';
import { hello } from './thing';

describe('hello', () => {
    it('should return HELLO!', () => {
        expect(hello()).toBe('HELLO!');
    });
});