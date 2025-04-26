import { ConstantExpr } from './ConstantExpr.js'
import { UndefinedExpr } from './UndefinedExpr.js'
import { ArgumentExpr } from './ArgumentExpr.js'
import * as Binary from './BinaryExpr.js'

export const E = {
    constant: ConstantExpr,
    undefined: new UndefinedExpr(),
    add: Binary.AddExpr,
    arg: ArgumentExpr,
}