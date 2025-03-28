import { DeepSExpression, SHA } from "."
import { getShaFromString } from "./toSha"

export class ShaRegistry {
    private readonly shas = new Map<SHA, DeepSExpression>()
    private readonly reverseLookup = new Map<DeepSExpression, SHA>()
    constructor() {
    }

    register(sExpression: DeepSExpression): DeepSExpression {
        const rootExpr = this.reverseLookup.get(sExpression)
        if (rootExpr) {
            return rootExpr
        }

        const sha = this.toSha(sExpression)
        const existingExpr = this.shas.get(sha)
        if (existingExpr) {
            this.reverseLookup.set(sExpression, sha)
            return existingExpr
        }

        this.shas.set(sha, sExpression)
        this.reverseLookup.set(sExpression, sha)

        return sExpression
    }

    private toSha(sExpression: DeepSExpression): SHA {
        switch (sExpression) {
            case undefined: return UNDEFINED
            case null: return NULL
            case TRUE: return TRUE
            case FALSE: return FALSE
            case 0: return ZERO
            case 1: return ONE
        }

        if (Array.isArray(sExpression)) {
            const [ first, ...rest ] = sExpression
            const newSExpression = [ first, ...rest.map(item => this.register(item)) ]
            const serialized = `[${newSExpression.join(' ')}]`
            const sha = getShaFromString(serialized)
            
            return sha
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