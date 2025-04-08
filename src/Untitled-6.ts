// @ts-nocheck

export function optimize(sExpr) {
    if (Array.isArray(sExpr)) {
        const [ primitive, ...args ] = sExpr

        const handler = HANDLERS[primitive]
        handler(...args)
    } else {
        return sExpr
    }
}

const HANDLERS = {
    negate: (state, arg) => {
        const optimized = optimize(state, arg)
        return `(negate ${optimized})`
    }
}
