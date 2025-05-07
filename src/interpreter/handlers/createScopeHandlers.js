export function createScopeHandlers(resolveDeep) {
    const scopes = [{}];

    return {
        setvar: (name, value) => {
            scopes[0][name] = value;
            return value;
        },

        getvar: (name) => {
            for (let i = 0; i < scopes.length; i++) {
                const curr = scopes[i]
                if (name in curr) {
                    return resolveDeep(curr[name])
                }   
            }
            return undefined
        },

        fn: (params, body) => {
            return (...args) => {
                // Pop into the next scope
                scopes.unshift({});

                const scope = scopes[0];
                for (let i = 0; i < params.length; i++) {
                    scope[params[i]] = args[i]
                }
                const result = resolveDeep(body)

                // And pop back out.
                scopes.shift()

                return result
            }
        },

        block: (...statements) => {
            // Pop into the next scope where there might be some variables set
            scopes.unshift({});

            let result = undefined

            for (const statement of statements) {
                result = resolveDeep(statement)
            }

            // And pop back out.
            scopes.shift()

            return result
        },

        call: (fn, ...args) => {
            const func = resolveDeep(fn);
            return func(...args);
        }
    };
}