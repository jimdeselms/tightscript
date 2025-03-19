import { Expr, SExpression } from "./expr"
import { getShaFromString } from "./toSha"

export class Registry {
    private readonly shas = new Map<string, Expr>
    private readonly reverseLookup = new Map<SExpression, Expr>()
    constructor() {
    }

    register(sExpression: SExpression): Expr {
        const rootExpr = this.reverseLookup.get(sExpression)
        if (rootExpr) {
            return rootExpr
        }

        const sha = this.toSha(sExpression)
        const existingExpr = this.shas.get(sha)
        if (existingExpr) {
            this.reverseLookup.set(sExpression, existingExpr)
            return existingExpr
        }

        const newRootExpr = {
            sExpression,
            isScalar: typeof sExpression !== 'object' || sExpression === null,
            sha
        }
        
        this.shas.set(sha, newRootExpr)
        this.reverseLookup.set(sExpression, newRootExpr)

        return newRootExpr
    }

    private toSha(sExpression: SExpression): string {
        switch (sExpression) {
            case undefined: return UNDEFINED
            case null: return NULL
            case TRUE: return TRUE
            case FALSE: return FALSE
            case 0: return ZERO
            case 1: return ONE
        }

        if (Array.isArray(sExpression)) {
            const serialized = `[${sExpression.map(this.toSha).join(",")}]`
            return getShaFromString(serialized)
        } else {
            return getShaFromString(JSON.stringify(sExpression))
        }
    }
}

const UNDEFINED = getShaFromString("undefined")
const NULL = getShaFromString("null")
const TRUE = getShaFromString("true")
const FALSE = getShaFromString("false")
const ZERO = getShaFromString("0")
const ONE = getShaFromString("1")