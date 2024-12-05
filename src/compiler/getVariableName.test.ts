import { describe, it, expect } from 'vitest';
import { getVariableName } from './getVariableName';

describe('getVariableName', () => {
    it.each([
        [0, 'A'],
        [1, 'B'],
        [23423, 'yAH'],
        [2938492384293482, 'PQto_xvEO'],
    ])('getVariableName %#%', (index, expected) => {
        expect(getVariableName(index)).toBe(expected);
    });
});
