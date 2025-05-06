export function createScopeHandlers() {
    const scopes = [{}];

    return {
        setvar: (name, value) => {
            scopes[0][name] = value;
            return value;
        },

        getvar: (name) => {
            return scopes[0][name];
        },
    };
}