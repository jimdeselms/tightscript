export class FinalCompiler {
    constructor() {
        this.ordinalFunctions = []
    }

    declareFunction(i, body) {
        const fnValue = this.toJs(body)
        const fn = `const $O${i}=${fnValue}`
        this.ordinalFunctions[i] = fn
    }

    compile(sExpr) {
        const ordinalFunctions = this.ordinalFunctions.join(';\n')
        const js = this.toJs(sExpr)
        return `((...$)=>{\n${ordinalFunctions};\nreturn ${js};\n})`
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
    arg: (i) => `($[${i}])`,
    fnref: (idx) => `$O${idx}`,
    negate: (val) => `(-${val})`,

    add: (lhs, rhs) => `(${lhs}+(${rhs}))`,
    mul: (lhs, rhs) => `(${lhs}*(${rhs}))`,

    sub: (lhs, rhs) => `(${lhs}-(${rhs}))`,
    sub_opp: (lhs, rhs) => `(${rhs}-(${lhs}))`,

    div: (lhs, rhs) => `(${lhs}/(${rhs}))`,
    div_opp: (lhs, rhs) => `(${rhs}/(${lhs}))`,

    lt: (a1, a2) => `(${a1}<${a2})`,
    lt_opp: (a1, a2) => `(${a2}>${a1})`,

    gt: (a1, a2) => `(${a1}>=${a2})`,
    gt_opp: (a1, a2) => `(${a2}<=${a1})`,

    le: (a1, a2) => `(${a1}<=${a2})`,
    le_opp: (a1, a2) => `(${a2}>=${a1})`,

    ge: (a1, a2) => `(${a1}>=${a2})`,
    ge_opp: (a1, a2) => `(${a2}<=${a1})`,

    error: (val) => `(new Error(${val}))`,

    if: (cond, ifTrue, ifFalse) => `(${cond}?${ifTrue}:${ifFalse})`,

    isNumber: (val) => `(typeof ${val}==='number')`,
    isString: (val) => `(typeof ${val}==='string')`,
    isBoolean: (val) => `(typeof ${val}==='boolean')`,
    isUndefined: (val) => `(${val}===undefined)`,
    isFunction: (val) => `(typeof ${val}==='function')`,
    isError: (val) => `(${val} instanceof Error)`,
    fn: (body) => `((...$)=>{return ${body}})`,
    call: (fn, ...args) => `((${fn})(${args.join(',')}))`,
    eq: (a1,a2) => `(${a1}===${a2})`,
}