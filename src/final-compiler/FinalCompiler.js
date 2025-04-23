export class FinalCompiler {

    constructor() {
    }

    compile(sExpr) {
        const js = this.toJs(sExpr)
        return `($0,$1,$2,$3)=>(${js})`
    }

    toJs(sExpr) {
        if (Array.isArray(sExpr)) {
            const [ prim, ...args ] = sExpr
            const primfn = PRIMITIVES[prim]
            if (!primfn) {
                throw `Unknown primitive ` +  prim
            }
            return PRIMITIVES[prim](...args.map(a => this.toJs(a)))
        } else {
            return JSON.stringify(sExpr)
        }
    }
}

const PRIMITIVES = {
    add: (lhs, rhs) => `(${lhs}+(${rhs}))`,
    negate: (val) => `(-${val})`,
    if: (cond, ifTrue, ifFalse) => `(${cond}?${ifTrue}:${ifFalse})`,
    isUndefined: (val) => `(${val}===undefined)`,
    isNumber: (val) => `(typeof ${val}==='number')`,
    isBoolean: (val) => `(typeof ${val}==='boolean')`,
    arg: (i) => `($${i})`,
    isError: (val) => `(${val} instanceof Error)`,
    error: (val) => `(new Error(${val}))`,
    lt: (a1, a2) => `(${a1}<${a2})`,
    gt: (a1, a2) => `(${a1}>${a2})`,
}