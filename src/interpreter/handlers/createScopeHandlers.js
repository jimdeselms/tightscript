export function createScopeHandlers(resolveDeep) {
    const scopes = [{}];

    return {
        setvar: (name, value) => {
            scopes[0][name] = value;
            return value;
        },

        getvar: (name) => {
            return scopes[0][name];
        },

        fn: (params, body) => {
            return (...args) => {
                scopes.unshift({});
                const scope = scopes[0];
                for (let i = 0; i < params.length; i++) {
                    scope[params[i]] = args[i]
                }
                const result = resolveDeep(body)
                scopes.shift()

                return result
            }
        },

        call: (fn, ...args) => {
            const func = resolveDeep(fn);
            return func(...args);
        }
    };
}