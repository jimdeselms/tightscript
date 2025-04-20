import { createHash } from "crypto"

export class Registry{
    constructor() {
        this.expressions = new Map()
        this.reverseLookup = new Map()
    }

    get(sExpr) {
        const sha = this.reverseLookup.get(sExpr)
        if (sha !== undefined) {
            return this.expressions.get(sha)
        } else {
            const serialized = this.serialize(sExpr)
            const sha = this.calcSha(serialized)
            const existing = this.expressions.get(sha)
            if (existing !== undefined) {
                return existing
            }

            // Haven't found it, so create it.
            const exprDetails = { expr: sExpr, sha }
            this.expressions.set(sha, exprDetails)
            this.reverseLookup.set(sExpr, sha)

            return exprDetails
        }
    }

    setDetail(expr, id, value) {
        const exprDetails = this.get(expr)
        exprDetails[id] = value
    }

    calcSha(str) {
        const sha = createHash('sha256')
        sha.update(str)
        return sha.digest('base64')
    }

    serialize(sExpr) {
        if (!Array.isArray(sExpr)) {
            return sExpr === undefined ? "undefined" : JSON.stringify(sExpr)
        } else {
            return sExpr.map(item => this.get(item).sha).join(' ')
        }
    }
}