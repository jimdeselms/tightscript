import * as Binary from './BinaryExpr.js'
import { ConstantExpr } from './ConstantExpr.js'
import { UndefinedExpr } from './UndefinedExpr.js'
import { ArgumentExpr } from './ArgumentExpr.js'
import { IfExpr } from './IfExpr.js'
import { ErrorExpr } from './ErrorExpr.js'
import { FnExpr } from './FnExpr.js'
import { CallExpr } from './CallExpr.js'

export const E = {
    constant: ConstantExpr,
    undefined: new UndefinedExpr(),
    add: Binary.AddExpr,
    arg: ArgumentExpr,
    if: IfExpr,
    error: ErrorExpr,
    fn: FnExpr,
    call: CallExpr,
}