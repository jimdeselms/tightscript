export type Type = {
    to: string[],
}

export function* searchRoutes(from: string, to: string, types: Record<string, Type>, prev: string[]=[]): Iterable<string[]> {
    if (from === to) {
        yield prev
    } else {
        const fromType = types[from]
        if (fromType.to.includes(to)) {
            yield [...prev, to]
        } else {
            for (const next of fromType.to) {
                if (!prev.includes(next)) {
                    yield* searchRoutes(next, to, types, [...prev, next])
                }
            }
        }
    }
}

export function searchRoute(from: string, to: string, types: Record<string, Type>): string[] | null {
    let shortest: string[] | null = null
    let min = Infinity

    for (const route of searchRoutes(from, to, types)) {
        if (route.length < min) {
            min = route.length
            shortest = route
        }
    }

    return shortest
}