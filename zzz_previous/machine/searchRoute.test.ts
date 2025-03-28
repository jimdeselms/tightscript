import { describe, expect, test } from 'vitest';
import { searchRoute, searchRoutes } from './searchRoute';

describe('searchRoutes', () => {
    test('it can go from A to B if A maps directly to B', () => {

        const types = {
            A: { to: ['B'] },
        }

        const routes = Array.from(searchRoutes('A', 'B', types))
        expect(routes).toEqual([['B']])
    })

    test('it can go from A to C if A maps to B and B maps to C', () => {
        const types = {
            A: { to: ['B'] },
            B: { to: ['C'] },
        }

        const routes = Array.from(searchRoutes('A', 'C', types))
        expect(routes).toEqual([['B', 'C']])
    })

    test('it returns an empty array if there are no valid routes', () => {
        const types = {
            A: { to: ['C'] },
            B: { to: ['D'] },
        }

        const routes = Array.from(searchRoutes('A', 'B', types))
        expect(routes).toEqual([])
    })

    test('if I map to myself, return a route that is empty', () => {
        const types = {
        }

        const routes = Array.from(searchRoutes('A', 'A', types))
        expect(routes).toEqual([[]])
    })

    test('if there are two mappings to the same place, return both', () => {
        const types = {
            A: { to: ['B', 'C'] },
            B: { to: ['D'] },
            C: { to: ['D']}
        }

        const routes = Array.from(searchRoutes('A', 'D', types))
        expect(routes).toEqual([['B', 'D'], ['C', 'D']])
    })
})

describe('searchRoute', () => {
    test('The path from A to itself is an empty array', () => {
        const route = searchRoute('A', 'A', {})
        expect(route).toEqual([])
    })

    test('The route from A to B is returned', () => {
        const route = searchRoute('A', 'B', {
            A: { to: ['B'] }
        })

        expect(route).toEqual(['B'])
    })

    test('If there are two matches of the same length, the first is returned', () => {
        const route = searchRoute('A', 'D', {
            A: { to: ['B', 'C'] },
            B: { to: ['D'] },
            C: { to: ['D'] },
        })

        expect(route).toEqual(['B', 'D'])
    })

    test('If there are two matches of different lengths, the shortest is returned if it is first', () => {
        const route = searchRoute('A', 'E', {
            A: { to: ['B', 'C'] },
            B: { to: ['C', 'E'] },
            C: { to: ['D'] },
            D: { to: ['E'] }
        })

        expect(route).toEqual(['B', 'E'])
    })

    test('If there are two matches of different lengths, the shortest is returned if it not first', () => {
        const route = searchRoute('A', 'E', {
            A: { to: ['B'] },
            B: { to: ['C', 'E'] },
            C: { to: ['D'] },
            D: { to: ['E'] }
        })

        expect(route).toEqual(['B', 'E'])
    })
})