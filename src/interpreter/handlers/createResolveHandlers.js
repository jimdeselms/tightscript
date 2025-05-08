export function createResolveHandlers(isResolved, step) {
    const handlers = {};

    handlers.resolve = (expr) => {
        if (isResolved(expr)) {
            return expr;
        }

        const [ primitive, ...args ] = expr

        // If any of the arguments are not resolved, then resolve them one step and pass the 
        if (args.some(a => !isResolved(a))) {
            return ['resolve', [ primitive, ...args.map(a => step(a))] ];
        } else {
            // If the args are resolved, then we can pass along the resolved expression.
            return expr
        }
    }

    return handlers;
}