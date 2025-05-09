export function createResolveHandlers(isResolved, step) {

    const isResolvedOrSkip = (expr) => {
        if (isResolved(expr)) {
            return true
        }

        return Array.isArray(expr) && expr[0] === 'resolve-skip'
    }

    const handlers = {
        resolve: (expr) => {
            if (isResolved(expr)) {
                return expr;
            }

            const [ primitive, ...args ] = expr

            if (primitive === 'array') {
                if (args[0].some(a => !isResolvedOrSkip(a))) {
                    return ['resolve', [ 'array', args[1].map(a => step(a))] ];
                } else {
                    return ['array', args]
                }
            } else if (args.some(a => !isResolvedOrSkip(a))) {
                return ['resolve', [ primitive, ...args.map(a => step(a))] ];
            } else {
                // If the args are resolved, then we can pass along the resolved expression.
                return expr
            }
        },

        array: (elements) => [ 'array', elements.map(e => step(e)) ],

        'resolve-skip': (expr) => expr,

        'resolved?': (expr) => isResolved(expr),
    }
    
    return handlers;;
}