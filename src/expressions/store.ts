import { ExpressionHub, isNonScalarValue, isScalarValue, NonScalarValue, SymbolicExpression } from "./expression";
import crypto from 'crypto'

export class ExpressionStore {
    // These could perhaps be replaced with LRU caches.
    private readonly expressions: Map<string, WeakRef<ExpressionHub>> = new Map<string, ExpressionHub>()
    private readonly reverseLookup: WeakMap<NonScalarValue, string> = new WeakMap<NonScalarValue, string>()

    constructor() {
    }

    get(expr: SymbolicExpression): ExpressionHub {
        if (!isScalarValue(expr)) {
            const existingSha = this.reverseLookup.get(expr)
            if (existingSha) {
                return this.expressions.get(existingSha)!
            }
        }

        const sha = this.getSha(expr)
        return this.expressions.get(sha)!
    }

    private getSha(expr: SymbolicExpression): string {
        const serialized = isScalarValue(expr)
            ? JSON.stringify(expr)
            : JSON.stringify(expr.map(e => this.getSha(e)))

        const sha = HASH.update(serialized).digest('hex')
        const hub = { symbolic: expr }
        this.expressions.set(sha, hub)

        if (isNonScalarValue(expr)) {
            this.reverseLookup.set(expr, sha)
        }

        return sha
    }
}

const HASH = crypto.createHash('sha256')
