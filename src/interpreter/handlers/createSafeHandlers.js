export function createSafeHandlers(coreHandlers, isResolved, step) {
    const handlers = {};

    for (const key of Object.keys(coreHandlers)) {
        const fnName = key + '-safe';
        handlers[fnName] = (...args) => {
            const resolvedArgs = [];
            let unresolvedFound = false;

            for (let i = 0; i < args.length; i++) {
                const arg = args[i];
                if (unresolvedFound || isResolved(arg)) {
                    resolvedArgs.push(arg);
                } else {
                    unresolvedFound = true;
                    resolvedArgs.push(step(arg));
                }
            }

            if (unresolvedFound) {
                return [fnName, ...resolvedArgs];
            } else {
                // Everything is resolved, so we can actually evaluate the thing for real.
                return [key, ...resolvedArgs];
            }
        };
    }

    return handlers;
}