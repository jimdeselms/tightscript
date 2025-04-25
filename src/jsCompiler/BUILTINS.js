import { parse } from '../parse.js'

export const BUILTINS = {
    error: parse('(error $)'),
    isError: parse('(isError $)'),
    isUndefined: parse('(isUndefined $)'),
}